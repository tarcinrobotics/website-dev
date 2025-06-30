import express, { Request, Response } from 'express';
import { authenticate, adminOnly, generateToken } from './authMiddleware';
import * as dataStorage from './dataStorage';
import { contactStorage, Contact } from "./dataStorage";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

import { readJSON, writeJSON } from './dataStorage';
import nodemailer from 'nodemailer';
import { addSubscriber } from './dataStorage';
import multer from "multer";

import dotenv from "dotenv";
dotenv.config();
// Ensure JWT_SECRET is defined 
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}


const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory
const contactFilePath = path.join(__dirname, "data", "contact.json");
const eventsFilePath = path.join(__dirname, "data", "events.json");
const blogFilePath = path.join(__dirname, "data", "blog.json");
const emailFilePath = path.join(__dirname, "data", "emails.json");
const forumPath = path.join(__dirname, "data","forum.json"); 


// Helper to read and write JSON
const readEvents = (): any[] => {
  if (fs.existsSync(eventsFilePath)) {
    const data = fs.readFileSync(eventsFilePath, "utf-8");
    return JSON.parse(data || "[]");
  }
  return [];
};

// write events for the events.json file
const writeEvents = (events: any[]) => {
  fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
};

const readBlogs = (): any[] => {
  if (!fs.existsSync(blogFilePath)) return [];
  const data = fs.readFileSync(blogFilePath, "utf-8");
  return JSON.parse(data || "[]");
};

const writeBlogs = (blogs: any[]) => {
  fs.writeFileSync(blogFilePath, JSON.stringify(blogs, null, 2));
};


// AUTHENTICATION
// router.post('/auth/login', (req: Request, res: Response) => {
//   try {
//     const { username, password } = req.body;
    
//     // Validate credentials
//     const user = dataStorage.validateAdminCredentials(username, password);
    
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
    
//     // Generate JWT token
//     const token = generateToken(user);
    
//     // Return user info and token
//     return res.json({
//       message: 'Login successful',
//       user,
//       token
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// AUTHENTICATION - Login
router.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validate credentials (custom method from your storage)
    const user = dataStorage.validateAdminCredentials(username, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token using generateToken from middleware
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    // Return the token and basic user info
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// BLOG ROUTES
// Get all blog posts
// router.get('/blog', (req: Request, res: Response) => {
//   try {
//     const posts = dataStorage.getBlogPosts();
//     res.json(posts);
//   } catch (error) {
//     console.error('Error getting blog posts:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get blog post by slug
// router.get('/blog/:slug', (req: Request, res: Response) => {
//   try {
//     const { slug } = req.params;
//     const post = dataStorage.getBlogPostBySlug(slug);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Blog post not found' });
//     }
    
//     res.json(post);
//   } catch (error) {
//     console.error('Error getting blog post:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Create a new blog post
// router.post('/blog', authenticate, (req: Request, res: Response) => {
//   try {
//     const post = req.body;
    
//     // Validate required fields
//     if (!post.title || !post.content || !post.author) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }
    
//     const newPost = dataStorage.createBlogPost(post);
//     res.status(201).json(newPost);
//   } catch (error) {
//     console.error('Error creating blog post:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update a blog post
// router.put('/blog/:id', authenticate, (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
    
//     const updatedPost = dataStorage.updateBlogPost(id, updates);
    
//     if (!updatedPost) {
//       return res.status(404).json({ message: 'Blog post not found' });
//     }
    
//     res.json(updatedPost);
//   } catch (error) {
//     console.error('Error updating blog post:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Delete a blog post
// router.delete('/blog/:id', authenticate, (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const success = dataStorage.deleteBlogPost(id);
    
//     if (!success) {
//       return res.status(404).json({ message: 'Blog post not found' });
//     }
    
//     res.json({ message: 'Blog post deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting blog post:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// 📌 GET /api/cms/blog — Get all blog post
// router.get("/blog", (req, res) => {
//   try {

//     const posts = readBlogs();
//     res.json(posts);
//   } catch (error) {
//     console.error("Error getting blog posts:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.post("/blog", authenticate, (req, res) => {
  try {
    const { title, content, author, image, tags, summary, published } = req.body;

    if (!title || !content || !author || !summary) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const posts = readBlogs();
    const slug = slugify(title, { lower: true, strict: true });

    const newPost = {
      id: uuidv4(),
      title,
      content,
      summary,
      author,
      slug,
      image: image || "",
      tags: tags || [],
      published: !!published,
      createdAt: new Date().toISOString(),
    };

    posts.push(newPost);
    writeBlogs(posts);

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ message: "Server error" });
  }
});


//GET /blog/:slug — Return One Post by Slug

router.get("/blog/:slug", (req, res) => {
  try {
    const { slug } = req.params;
    const posts = readBlogs();
    const post = posts.find(p => p.slug === slug);

    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error getting blog post:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// POST /blog — Create New Blog Post
router.post("/blog", authenticate, (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const posts = readBlogs();
    const slug = slugify(title, { lower: true, strict: true });
    const newPost = {
      id: uuidv4(),
      title,
      content,
      author,
      slug,
      createdAt: new Date().toISOString(),
    };

    posts.push(newPost);
    writeBlogs(posts);

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ message: "Server error" });
  }
});


//PUT /blog/:id — Update a Post
router.put("/blog/:id", authenticate, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const posts = readBlogs();
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const updatedPost = {
      ...posts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    posts[index] = updatedPost;
    writeBlogs(posts);

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /blog/:id — Delete a Post
router.delete("/blog/:id", authenticate, (req, res) => {
  try {
    const { id } = req.params;

    const posts = readBlogs();
    const updatedPosts = posts.filter(p => p.id !== id);

    if (posts.length === updatedPosts.length) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    writeBlogs(updatedPosts);
    res.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// EVENT ROUTES
// Get all events
// router.get('/events', (req: Request, res: Response) => {
//   try {
//     const events = dataStorage.getEvents();
//     res.json(events);
//   } catch (error) {
//     console.error('Error getting events:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// 📌 POST /api/cms/events — Create new event
router.post("/events", (req, res) => {
  try {
    const events = readEvents();
    const newEvent = { id: uuidv4(), ...req.body };
    events.push(newEvent);
    writeEvents(events);

    res.status(200).json({ success: true, data: newEvent });
  } catch (err) {
    console.error("Failed to create event:", err);
    res.status(500).json({ success: false, message: "Could not create event" });
  }
});

// Get upcoming events
// router.get('/events/upcoming', (req: Request, res: Response) => {
//   try {
//     const events = dataStorage.getUpcomingEvents();
//     res.json(events);
//   } catch (error) {
//     console.error('Error getting upcoming events:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.get("/events/upcoming", (req: Request, res: Response) => {
  try {
    const events = readEvents();
    const now = new Date();
    const upcoming = events.filter(event => new Date(event.date) >= now);
    res.json(upcoming);
  } catch (error) {
    console.error("Error getting upcoming events:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Get past events
// router.get('/events/past', (req: Request, res: Response) => {
//   try {
//     const events = dataStorage.getPastEvents();
//     res.json(events);
//   } catch (error) {
//     console.error('Error getting past events:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.get("/events/past", (req: Request, res: Response) => {
  try {
    const events = readEvents();
    const now = new Date();
    const past = events.filter(event => new Date(event.date) < now);
    res.json(past);
  } catch (error) {
    console.error("Error getting past events:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Create a new event
// router.post('/events', authenticate, (req: Request, res: Response) => {
//   try {
//     const event = req.body;
    
//     // Validate required fields
//     if (!event.title || !event.description || !event.date || !event.location) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }
    
//     const newEvent = dataStorage.createEvent(event);
//     res.status(201).json(newEvent);
//   } catch (error) {
//     console.error('Error creating event:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.get("/events", (req: Request, res: Response) => {
  try {
    const events = readEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error reading events file:", error);
    res.status(500).json({ message: "Failed to load events" });
  }
});


// Update an event
// router.put('/events/:id', authenticate, (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
    
//     const updatedEvent = dataStorage.updateEvent(id, updates);
    
//     if (!updatedEvent) {
//       return res.status(404).json({ message: 'Event not found' });
//     }
    
//     res.json(updatedEvent);
//   } catch (error) {
//     console.error('Error updating event:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// 📌 PUT /api/cms/events/:id — Update event
router.put("/events/:id", (req, res) => {
  try {
    const { id } = req.params;
    const events = readEvents();
    const index = events.findIndex(e => e.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const updatedEvent = { ...events[index], ...req.body, id }; // preserve original ID
    events[index] = updatedEvent;
    writeEvents(events);

    res.status(200).json({ success: true, data: updatedEvent });
  } catch (err) {
    console.error("Failed to update event:", err);
    res.status(500).json({ success: false, message: "Could not update event" });
  }
});

// Delete an event
router.delete('/events/:id', authenticate, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = dataStorage.deleteEvent(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CAREER ROUTES
// Get all careers
router.get('/careers', (req: Request, res: Response) => {
  try {
    const careers = dataStorage.getCareers();
    res.json(careers);
  } catch (error) {
    console.error('Error getting careers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active careers
router.get('/careers/active', (req: Request, res: Response) => {
  try {
    const careers = dataStorage.getActiveCareers();
    res.json(careers);
  } catch (error) {
    console.error('Error getting active careers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new career
router.post('/careers', authenticate, (req: Request, res: Response) => {
  try {
    const career = req.body;
    
    // Validate required fields
    if (!career.title || !career.department || !career.location || !career.description || !career.requirements) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newCareer = dataStorage.createCareer(career);
    res.status(201).json(newCareer);
  } catch (error) {
    console.error('Error creating career:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a career
router.put('/careers/:id', authenticate, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedCareer = dataStorage.updateCareer(id, updates);
    
    if (!updatedCareer) {
      return res.status(404).json({ message: 'Career not found' });
    }
    
    res.json(updatedCareer);
  } catch (error) {
    console.error('Error updating career:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a career
router.delete('/careers/:id', authenticate, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = dataStorage.deleteCareer(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Career not found' });
    }
    
    res.json({ message: 'Career deleted successfully' });
  } catch (error) {
    console.error('Error deleting career:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// COMMUNITY STORIES ROUTES
// Get all approved community stories
router.get('/community-stories', (req: Request, res: Response) => {
  try {
    const stories = dataStorage.getCommunityStories(true);
    res.json(stories);
  } catch (error) {
    console.error('Error getting community stories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all community stories (including pending) - admin only
router.get('/community-stories/all', authenticate, (req: Request, res: Response) => {
  try {
    const stories = dataStorage.getCommunityStories(false);
    res.json(stories);
  } catch (error) {
    console.error('Error getting all community stories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit a new community story
router.post('/community-stories/submit', (req: Request, res: Response) => {
  try {
    const story = req.body;
    
    // Validate required fields
    if (!story.name || !story.role || !story.story) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newStory = dataStorage.createCommunityStory(story);
    res.status(201).json({
      message: 'Story submitted successfully and pending approval',
      story: newStory
    });
  } catch (error) {
    console.error('Error submitting community story:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve a community story
router.put('/community-stories/:id/approve', authenticate, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    
    if (approved === undefined) {
      return res.status(400).json({ message: 'Approved status is required' });
    }
    
    const updatedStory = dataStorage.approveCommunityStory(id, approved);
    
    if (!updatedStory) {
      return res.status(404).json({ message: 'Community story not found' });
    }
    
    res.json({
      message: approved ? 'Story approved successfully' : 'Story approval revoked',
      story: updatedStory
    });
  } catch (error) {
    console.error('Error approving community story:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a community story
router.delete('/community-stories/:id', authenticate, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = dataStorage.deleteCommunityStory(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Community story not found' });
    }
    
    res.json({ message: 'Community story deleted successfully' });
  } catch (error) {
    console.error('Error deleting community story:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// contact details

// router.post("/contact", async (req, res) => {
//   try {
//     const body = req.body;
//     const contact: Contact = {
//       ...body,
//       createdAt: new Date().toISOString(),
//     };
//     contactStorage.push(contact);
//     res.status(200).json({ success: true, message: "Contact saved successfully." });
//     console.log("Request received:", req.body);

//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to save contact." });
//     console.error("Error in /api/contact:", error);

//   }
// });

router.post("/contact", async (req, res) => {
  try {
    const body = req.body;

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const contact = {
      ...body,
      createdAt: new Date().toISOString(),
    };

    // Read existing data or initialize an empty array
    let contacts: any[] = [];

    if (fs.existsSync(contactFilePath)) {
      const fileData = fs.readFileSync(contactFilePath, "utf-8");
      contacts = JSON.parse(fileData || "[]");
    }

    // Append the new contact
    contacts.push(contact);

    // Write updated data back to file
    fs.writeFileSync(contactFilePath, JSON.stringify(contacts, null, 2));

    res.status(200).json({ success: true, message: "Contact saved successfully." });
    console.log("Request received and saved:", contact);

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to save contact." });
    console.error("Error in /api/contact:", error);
  }
});


//email contact details

const SUBSCRIBER_FILE = 'subscribers.json';

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/newsletter/subscribe
router.post('/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const subscribers = readJSON(SUBSCRIBER_FILE);
  if (subscribers.find(sub => sub.email === email)) {
    return res.status(409).json({ message: 'Email already subscribed' });
  }

  subscribers.push({ email });
  writeJSON(SUBSCRIBER_FILE, subscribers);

  // Send confirmation email
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Subscribed to Tarcin Robotic LLP Newsletter',
    html: `<h2>Thank you!</h2><p>You will now receive our updates on events and blogs.</p>`
  });

  res.status(200).json({ message: 'Subscribed successfully!' });
});

router.post('/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const subscriber = addSubscriber(email);
  res.status(201).json({ message: 'Subscribed successfully', subscriber });
});


// upload resume


const upload = multer({ storage: multer.memoryStorage() });
const dataFilePath = path.join(__dirname, "data", "resumes.json");

// Ensure resumes.json exists
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]), "utf-8");
}

export const handleResumeUpload = [
  upload.single("resume"),
  (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No resume uploaded" });
    }

    const resumeEntry = {
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };

    try {
      const fileData = fs.readFileSync(dataFilePath, "utf-8");
      const resumes = JSON.parse(fileData);
      resumes.push(resumeEntry);
      fs.writeFileSync(dataFilePath, JSON.stringify(resumes, null, 2));

      res.status(200).json({ message: "Resume uploaded successfully" });
    } catch (err) {
      console.error("Failed to save resume:", err);
      res.status(500).json({ error: "Failed to save resume" });
    }
  },
];


// community

// Log the file path
console.log("Forum JSON path:", forumPath);

// GET route
router.get("/", (req, res) => {
  fs.readFile(forumPath, "utf8", (err, data) => {
    if (err) {
      console.error("Read error:", err);
      return res.status(500).json({ error: "Unable to read forum data." });
    }
    res.json(JSON.parse(data || "[]"));
  });
});

// POST route
router.post("/", (req, res) => {
  const { name, question } = req.body;

  if (!name || !question) {
    return res.status(400).json({ error: "Name and question are required." });
  }

  const newPost = {
    id: Date.now().toString(),
    name,
    question,
    createdAt: new Date().toISOString(),
  };

  fs.readFile(forumPath, "utf8", (err, data) => {
    if (err) {
      console.error("Read error:", err);
      return res.status(500).json({ error: "Error reading forum data." });
    }

    let posts = [];
    try {
      posts = JSON.parse(data || "[]");
    } catch (parseErr) {
      console.error("Parse error:", parseErr);
      return res.status(500).json({ error: "Error parsing forum data." });
    }

    posts.push(newPost);

    fs.writeFile(forumPath, JSON.stringify(posts, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Write error:", writeErr);
        return res.status(500).json({ error: "Error saving forum data." });
      }
      res.json(newPost);
    });
  });
});

export default router;


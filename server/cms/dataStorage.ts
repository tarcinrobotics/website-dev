import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Path to data storage directory
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// File paths for different data collections
const BLOG_POSTS_FILE = path.join(DATA_DIR, 'blog-posts.json');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const CAREERS_FILE = path.join(DATA_DIR, 'careers.json');
const COMMUNITY_STORIES_FILE = path.join(DATA_DIR, 'community-stories.json');
const ADMIN_USERS_FILE = path.join(DATA_DIR, 'admin-users.json');

const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

export interface Subscriber {
  email: string;
  subscribedAt: string;
}




// Type definitions
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string;
  image?: string;
  tags?: string[];
  published: boolean;
}

export interface NewBlogPost {
  title: string;
  summary: string;
  content: string;
  author: string;
  image?: string;
  tags?: string[];
  published?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  registrationLink?: string;
  image?: string;
  isUpcoming: boolean;
}

export interface NewEvent {
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  registrationLink?: string;
  image?: string;
}

export interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string[];
  isActive: boolean;
  applicationLink?: string;
  postedDate: string;
}

export interface NewCareer {
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string[];
  isActive?: boolean;
  applicationLink?: string;
}

export interface CommunityStory {
  id: string;
  name: string;
  role: string;
  institution?: string;
  story: string;
  image?: string;
  approved: boolean;
  submissionDate: string;
}

export interface NewCommunityStory {
  name: string;
  role: string;
  institution?: string;
  story: string;
  image?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'editor';
}

export interface Contact {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  privacy: boolean;
  createdAt: Date;
}

export const contactStorage: Contact[] = [];



// Initialize empty data files if they don't exist
const initDataFile = <T>(filePath: string, initialData: T): void => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
  }
};

// Initialize all data files with empty arrays
initDataFile<BlogPost[]>(BLOG_POSTS_FILE, []);
initDataFile<Event[]>(EVENTS_FILE, []);
initDataFile<Career[]>(CAREERS_FILE, []);
initDataFile<CommunityStory[]>(COMMUNITY_STORIES_FILE, []);

initDataFile<Subscriber[]>(SUBSCRIBERS_FILE, []);

// Initialize admin users with a default admin user
initDataFile<AdminUser[]>(ADMIN_USERS_FILE, [
  {
    id: uuidv4(),
    username: 'admin',
    password: 'admin123', // This should be hashed in a real application
    role: 'admin'
  }
]);

// Helper functions to read and write data
const readData = <T>(filePath: string): T => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading data from ${filePath}:`, error);
    throw error;
  }
};

const writeData = <T>(filePath: string, data: T): void => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing data to ${filePath}:`, error);
    throw error;
  }
};

// Generate a URL-friendly slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Determine if an event is upcoming based on its date
const isEventUpcoming = (date: string): boolean => {
  const eventDate = new Date(date);
  const now = new Date();
  return eventDate >= now;
};

// Blog post operations
export const getBlogPosts = (): BlogPost[] => {
  return readData<BlogPost[]>(BLOG_POSTS_FILE);
};

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  const posts = getBlogPosts();
  return posts.find(post => post.slug === slug);
};

// export const createBlogPost = (post: NewBlogPost): BlogPost => {
//   const posts = getBlogPosts();
//   const slug = generateSlug(post.title);
  
//   // Ensure slug is unique
//   let uniqueSlug = slug;
//   let counter = 1;
//   while (posts.some(p => p.slug === uniqueSlug)) {
//     uniqueSlug = `${slug}-${counter}`;
//     counter++;
//   }
  
//   const newPost: BlogPost = {
//     id: uuidv4(),
//     slug: uniqueSlug,
//     publishDate: new Date().toISOString(),
//     published: post.published !== undefined ? post.published : false,
//     ...post
//   };
  
//   posts.push(newPost);
//   writeData(BLOG_POSTS_FILE, posts);
  
//   return newPost;
// };

export const createBlogPost = async (post: NewBlogPost): Promise<BlogPost> => {
  const posts = getBlogPosts();
  const slug = generateSlug(post.title);
  let uniqueSlug = slug;
  let counter = 1;
  while (posts.some(p => p.slug === uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  const newPost: BlogPost = {
    id: uuidv4(),
    slug: uniqueSlug,
    publishDate: new Date().toISOString(),
    published: post.published !== undefined ? post.published : false,
    ...post
  };

  posts.push(newPost);
  writeData(BLOG_POSTS_FILE, posts);

  // ✉️ Notify Subscribers
  await sendToAllSubscribers("📰 New Blog Posted!", `<h3>${newPost.title}</h3><p>${newPost.summary}</p>`);

  return newPost;
};


export const updateBlogPost = (id: string, updates: Partial<BlogPost>): BlogPost | null => {
  const posts = getBlogPosts();
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Generate a new slug if title is updated
  let slug = posts[index].slug;
  if (updates.title) {
    slug = generateSlug(updates.title);
    
    // Ensure slug is unique (skip the current post)
    let uniqueSlug = slug;
    let counter = 1;
    while (posts.some(p => p.id !== id && p.slug === uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    
    updates.slug = uniqueSlug;
  }
  
  const updatedPost = { ...posts[index], ...updates };
  posts[index] = updatedPost;
  
  writeData(BLOG_POSTS_FILE, posts);
  
  return updatedPost;
};

export const deleteBlogPost = (id: string): boolean => {
  const posts = getBlogPosts();
  const filteredPosts = posts.filter(post => post.id !== id);
  
  if (filteredPosts.length === posts.length) {
    return false;
  }
  
  writeData(BLOG_POSTS_FILE, filteredPosts);
  
  return true;
};

// Event operations
export const getEvents = (): Event[] => {
  return readData<Event[]>(EVENTS_FILE);
};

export const getUpcomingEvents = (): Event[] => {
  const events = getEvents();
  return events.filter(event => event.isUpcoming);
};

export const getPastEvents = (): Event[] => {
  const events = getEvents();
  return events.filter(event => !event.isUpcoming);
};

export const createEvent = (event: NewEvent): Event => {
  const events = getEvents();
  
  const newEvent: Event = {
    id: uuidv4(),
    isUpcoming: isEventUpcoming(event.date),
    ...event
  };
  
  events.push(newEvent);
  writeData(EVENTS_FILE, events);
  
  return newEvent;
};

export const updateEvent = (id: string, updates: Partial<Event>): Event | null => {
  const events = getEvents();
  const index = events.findIndex(event => event.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Update isUpcoming status if date is changed
  if (updates.date) {
    updates.isUpcoming = isEventUpcoming(updates.date);
  }
  
  const updatedEvent = { ...events[index], ...updates };
  events[index] = updatedEvent;
  
  writeData(EVENTS_FILE, events);
  
  return updatedEvent;
};

export const deleteEvent = (id: string): boolean => {
  const events = getEvents();
  const filteredEvents = events.filter(event => event.id !== id);
  
  if (filteredEvents.length === events.length) {
    return false;
  }
  
  writeData(EVENTS_FILE, filteredEvents);
  
  return true;
};

// Career operations
export const getCareers = (): Career[] => {
  return readData<Career[]>(CAREERS_FILE);
};

export const getActiveCareers = (): Career[] => {
  const careers = getCareers();
  return careers.filter(career => career.isActive);
};

export const createCareer = (career: NewCareer): Career => {
  const careers = getCareers();
  
  const newCareer: Career = {
    id: uuidv4(),
    isActive: career.isActive !== undefined ? career.isActive : true,
    postedDate: new Date().toISOString(),
    ...career
  };
  
  careers.push(newCareer);
  writeData(CAREERS_FILE, careers);
  
  return newCareer;
};

export const updateCareer = (id: string, updates: Partial<Career>): Career | null => {
  const careers = getCareers();
  const index = careers.findIndex(career => career.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedCareer = { ...careers[index], ...updates };
  careers[index] = updatedCareer;
  
  writeData(CAREERS_FILE, careers);
  
  return updatedCareer;
};

export const deleteCareer = (id: string): boolean => {
  const careers = getCareers();
  const filteredCareers = careers.filter(career => career.id !== id);
  
  if (filteredCareers.length === careers.length) {
    return false;
  }
  
  writeData(CAREERS_FILE, filteredCareers);
  
  return true;
};

// Community story operations
export const getCommunityStories = (onlyApproved = true): CommunityStory[] => {
  const stories = readData<CommunityStory[]>(COMMUNITY_STORIES_FILE);
  return onlyApproved ? stories.filter(story => story.approved) : stories;
};

export const createCommunityStory = (story: NewCommunityStory): CommunityStory => {
  const stories = getCommunityStories(false);
  
  const newStory: CommunityStory = {
    id: uuidv4(),
    approved: false,
    submissionDate: new Date().toISOString(),
    ...story
  };
  
  stories.push(newStory);
  writeData(COMMUNITY_STORIES_FILE, stories);
  
  return newStory;
};

export const approveCommunityStory = (id: string, approved: boolean): CommunityStory | null => {
  const stories = getCommunityStories(false);
  const index = stories.findIndex(story => story.id === id);
  
  if (index === -1) {
    return null;
  }
  
  stories[index].approved = approved;
  writeData(COMMUNITY_STORIES_FILE, stories);
  
  return stories[index];
};

export const deleteCommunityStory = (id: string): boolean => {
  const stories = getCommunityStories(false);
  const filteredStories = stories.filter(story => story.id !== id);
  
  if (filteredStories.length === stories.length) {
    return false;
  }
  
  writeData(COMMUNITY_STORIES_FILE, filteredStories);
  
  return true;
};

// Admin user operations
export const getAdminUsers = (): AdminUser[] => {
  return readData<AdminUser[]>(ADMIN_USERS_FILE);
};

export const validateAdminCredentials = (username: string, password: string): AdminUser | null => {
  const users = getAdminUsers();
  const user = users.find(user => user.username === username && user.password === password);
  
  if (!user) {
    return null;
  }
  
  // Don't return the password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as AdminUser;
};


//email contact storage fuction
// export const readJSON = (filePath: string) => {
//   const fullPath = path.join(__dirname, 'data', filePath);
//   const raw = fs.readFileSync(fullPath, 'utf-8');
//   return JSON.parse(raw);
// };

// export const writeJSON = (filePath: string, data: any) => {
//   const fullPath = path.join(__dirname, 'data', filePath);
//   fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
// };

// Required imports



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// JSON helpers
export const readJSON = (filePath: string) => {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
};

export const writeJSON = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Subscriber helpers
export const getSubscribers = (): Subscriber[] => {
  return readJSON(SUBSCRIBERS_FILE);
};

export const addSubscriber = (email: string): Subscriber => {
  const subscribers = getSubscribers();
  const newSubscriber: Subscriber = {
    email,
    subscribedAt: new Date().toISOString()
  };
  subscribers.push(newSubscriber);
  writeJSON(SUBSCRIBERS_FILE, subscribers);
  return newSubscriber;
};

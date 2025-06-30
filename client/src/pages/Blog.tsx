import React, { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Search, TagIcon, User } from "lucide-react";
import DocumentHead from "@/components/shared/DocumentHead";
import { format } from "date-fns";


interface BlogPost {
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

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  // Format date
  const formattedDate = format(new Date(post.publishDate), "MMM d, yyyy");
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {post.image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
          <span className="mx-2">•</span>
          <User className="h-4 w-4 mr-1" />
          <span>{post.author}</span>
        </div>
        <CardTitle className="text-xl font-bold hover:text-blue-800 transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <p className="text-gray-600">{post.summary}</p>
      </CardContent>
      <CardFooter className="pt-0 flex flex-wrap gap-2">
        {post.tags && post.tags.map(tag => (
          <Badge key={tag} variant="outline" className="text-xs bg-blue-50">
            <TagIcon className="h-3 w-3 mr-1" />
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};

const staticBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Revolutionizing Robotics in Education",
    slug: "robotics-in-education",
    summary: "Discover how robotics is transforming learning environments for the next generation.",
    content: "Full article content goes here...",
    author: "Tarcin Team",
    publishDate: "2025-06-01",
    image: "https://images.stockcake.com/public/d/5/c/d5c63fff-17b0-4e06-8b9d-933385f68194_large/kids-building-robot-stockcake.jpg",
    tags: ["Robotics", "Education", "Innovation"],
    published: true,
  },
  {
    id: "2",
    title: "AI-Powered IoT: The Future of Automation",
    slug: "ai-powered-iot",
    summary: "Explore how AI and IoT integration is paving the way for smarter systems.",
    content: "Full article content goes here...",
    author: "Tarcin Experts",
    publishDate: "2025-06-10",
    image: "https://www.metricstream.com/sites/default/files/styles/raw_original_image/public/2025-04/blog-dsk-Weekly-Blog-Upload--Apr-22th-2025.webp?itok=VYo3StSP",
    tags: ["AI", "IoT", "Automation"],
    published: true,
  },
  // {
  //   id: "3",
  //   title: "How to Start Your Journey in Robotics",
  //   slug: "start-your-robotics-journey",
  //   summary: "A beginner's guide to building a successful career in the robotics field.",
  //   content: "Full article content goes here...",
  //   author: "Jane Doe",
  //   publishDate: "2025-05-15",
  //   image: "https://via.placeholder.com/600x300.png?text=Getting+Started+Robotics",
  //   tags: ["Career", "Beginner", "Robotics"],
  //   published: true,
  // },
];


const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Fetch blog posts
  // const { data: posts = [], isLoading } = useQuery({ 
  //   queryKey: ['/api/cms/blog'],
  //   queryFn: getQueryFn({ on401: "returnNull" })
  // });
  const { data: posts = [], isLoading } = useQuery({
  queryKey: ['static-blog-posts'],
  queryFn: async () => {
    return new Promise<BlogPost[]>((resolve) => {
      setTimeout(() => resolve(staticBlogPosts), 500); // simulate loading
    });
  }
});



  // Extract all unique tags from posts
  const allTags = Array.from(
    new Set(
      (posts as BlogPost[]).flatMap(post => post.tags || [])
    )
  );
  
  // Filter posts based on search query, active tag, and category
  const filteredPosts = (posts as BlogPost[]).filter((post: BlogPost) => {
    // Only show published posts
    if (!post.published) return false;
    
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tag
    const matchesTag = activeTag === null || (post.tags && post.tags.includes(activeTag));
    
    return matchesSearch && matchesTag;
  });
  
  // Content to show when no posts match the filters
  const noPostsContent = (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium mb-2">No posts found</h3>
      <p className="text-gray-600 mb-4">
        Try adjusting your search criteria or check back later for new content.
      </p>
      <Button onClick={() => {
        setSearchQuery("");
        setActiveTag(null);
        setActiveCategory("all");
      }}>
        Clear filters
      </Button>
    </div>
  );
  
  return (
    <>
      <DocumentHead
        title="Blog - Latest News and Insights"
        description="Read the latest news, insights and technological developments from Tarcin Robotic."
      />
      
      <section className="mt-20 bg-blue-900 text-white py-16">

<div className="absolute inset-0 opacity-20 animate-hex-wave">
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="hex-pattern" width="26" height="48" patternUnits="userSpaceOnUse">
        <polygon
          points="15,0 30,8 30,26 15,34 0,26 0,8"
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
        />
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#hex-pattern)" />
  </svg>
</div>

<style>
{`
  @keyframes hexWaveMove {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(-20px, -10px);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  .animate-hex-wave svg {
    animation: hexWaveMove 6s ease-in-out infinite;
  }
`}
</style>


        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Blog</h1>
          <p className="text-blue-100 max-w-2xl">
            Explore our latest articles, insights, and updates on robotics, AI, IoT solutions, 
            and more from our team of experts.
          </p>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with search and filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={activeTag === null ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setActiveTag(null)}
                  >
                    All
                  </Badge>
                  {allTags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant={activeTag === tag ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setActiveTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Blog posts */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="h-[300px] animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post: BlogPost) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              noPostsContent
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
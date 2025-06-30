import React from "react";
import { Link, useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, ChevronLeft, TagIcon, User } from "lucide-react";
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

const BlogPost: React.FC = () => {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/blog/:slug");
  
  if (!match) {
    return null;
  }
  
  const { slug } = params;
  
  // Fetch blog post by slug
  const { data: post = {}, isLoading, error } = useQuery({
    queryKey: ['/api/cms/blog', slug],
    queryFn: getQueryFn({ on401: "returnNull" })
  });
  
  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Post</h1>
        <p className="mb-6">We couldn't load the requested blog post. It may not exist or there might be a temporary issue.</p>
        <Button onClick={() => navigate("/blog")}>
          <ChevronLeft className="mr-2" size={16} /> Back to Blog
        </Button>
      </div>
    );
  }
  
  // Format date from ISO string
  const formattedDate = post.publishDate 
    ? format(new Date(post.publishDate), "MMMM d, yyyy") 
    : "";
  
  return (
    <>
      <DocumentHead
        title={post.title ? `${post.title} - Tarcin Robotic Blog` : "Blog Post"}
        description={post.summary || "Read this insightful blog post from Tarcin Robotic."}
        image={post.image}
        type="article"
      />
      
      {isLoading ? (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="w-24 h-4 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8 animate-pulse" />
          <div className="h-64 bg-gray-200 rounded mb-8 animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          {/* Hero section with image */}
          {post.image && (
            <div className="w-full h-[400px] relative">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
                <p className="text-lg text-white/80">{post.summary}</p>
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            {/* Back to blog button */}
            <Button 
              variant="outline" 
              className="mb-6"
              onClick={() => navigate("/blog")}
            >
              <ChevronLeft className="mr-2" size={16} /> Back to Blog
            </Button>
            
            {/* Title (only shown if no image) */}
            {!post.image && (
              <>
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <p className="text-xl text-gray-600 mb-6">{post.summary}</p>
              </>
            )}
            
            {/* Meta information */}
            <div className="flex items-center text-gray-600 mb-8">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{formattedDate}</span>
              </div>
              <span className="mx-3">|</span>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{post.author}</span>
              </div>
            </div>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="bg-blue-50">
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <Separator className="mb-8" />
            
            {/* Main content */}
            <div 
              className="prose prose-lg max-w-none prose-blue prose-headings:text-blue-900 prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <Separator className="my-8" />
            
            {/* Author section */}
            <Card className="bg-blue-50 border-blue-100 mb-8">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-xl">
                    {post.author ? post.author.charAt(0).toUpperCase() : "A"}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{post.author}</h3>
                    <p className="text-gray-600">
                      Expert at Tarcin Robotic with a passion for technology and innovation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Navigation button */}
            <div className="text-center mt-8">
              <Button onClick={() => navigate("/blog")}>
                <ChevronLeft className="mr-2" size={16} /> Back to Blog
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BlogPost;
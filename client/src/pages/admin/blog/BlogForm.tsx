import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { error } from "console";

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

interface BlogFormProps {
  blog: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  image: z.string().optional(),
  tags: z.string().optional().transform(val => val ? val.split(',').map(tag => tag.trim()) : []),
  published: z.boolean().default(false),
});



export default function BlogForm({ blog, isOpen, onClose }: BlogFormProps) {
  const { toast } = useToast();
  const isEditing = !!blog;

  // Create form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: blog?.title || "",
      summary: blog?.summary || "",
      content: blog?.content || "",
      author: blog?.author || "",
      image: blog?.image || "",
      tags: blog?.tags?.join(", ") || "",
      published: blog?.published || false,
    },
  });

  // // Create/update mutation
  // const mutation = useMutation({
  //   mutationFn: async (values: z.infer<typeof formSchema>) => {
  //     const endpoint = isEditing 
  //       ? `/api/cms/blog/${blog.id}`
  //       : "/api/cms/blog";
      
  //     const method = isEditing ? "PUT" : "POST";
  //     const token = localStorage.getItem("authToken");
  //     if (!token) {
  //       throw new Error("User not authenticated");
  //     }
      
  //     return await apiRequest(endpoint, { 
  //       method,
  //       headers: {
  //                 "Content-Type": "application/json",
  //                 "Authorization": `Bearer ${token}`,
  //               },
  //       body: JSON.stringify(values),
  //     }).then(res => {
  //                     if (!res.ok) {
  //                         return res.json().then(err => {
  //                             throw new Error(err.message || "Failed to submit blog");
  //                         });
  //                     }
  //   return res.json();
  // });
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['/api/cms/blog'] });
  //     toast({
  //       title: isEditing ? "Blog post updated" : "Blog post created",
  //       description: `Blog post has been ${isEditing ? "updated" : "created"} successfully.`,
  //     });
  //     onClose();
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: "Error",
  //       description: `Failed to ${isEditing ? "update" : "create"} blog post: ${error.message}`,
  //       variant: "destructive",
  //     });
  //   },
  // });

  // Create/update mutation
const mutation = useMutation({
  mutationFn: async (values: z.infer<typeof formSchema>) => {
    const isEditMode = isEditing && blog?.id;
    const endpoint = isEditMode
      ? `/api/cms/blog/${blog.id}`
      : `/api/cms/blog`;

    const method = isEditMode ? "PUT" : "POST";

    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to submit blog");
    }

    return data;
  },

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/cms/blog'] });

    toast({
      title: isEditing ? "Blog post updated" : "Blog post created",
      description: `Blog post has been ${isEditing ? "updated" : "created"} successfully.`,
    });

    onClose();
  },

  onError: (error: any) => {
    toast({
      title: "Error",
      description: `Failed to ${isEditing ? "update" : "create"} blog post: ${error.message}`,
      variant: "destructive",
    });
  },
});


  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter blog post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a short summary" 
                      className="min-h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter blog post content" 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Image URL (optional)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a URL for the blog image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Tags (comma separated)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter tags separated by commas (e.g. robotics, AI, innovation)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Published</FormLabel>
                    <FormDescription>
                      Set this post as published and visible on the website.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⊚</span>
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditing ? "Update" : "Create"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
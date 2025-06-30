import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Calendar, Quote, User } from "lucide-react";
import DocumentHead from "@/components/shared/DocumentHead";
import { format, parseISO } from "date-fns";
import CommunityForum from "@/components/community/CommunityForum";

interface CommunityStory {
  id: string;
  name: string;
  role: string;
  institution?: string;
  story: string;
  image?: string;
  approved: boolean;
  submissionDate: string;
}

// Form validation schema
const storyFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  institution: z.string().optional(),
  story: z.string().min(20, "Your story must be at least 20 characters"),
  image: z.string().optional(),
});

type StoryFormValues = z.infer<typeof storyFormSchema>;

const StoryCard: React.FC<{ story: CommunityStory }> = ({ story }) => {
  // Format date
  const formattedDate = format(parseISO(story.submissionDate), "MMM d, yyyy");
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {story.image ? (
              <img 
                src={story.image} 
                alt={story.name} 
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-xl">
                {story.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold">{story.name}</h3>
            <div className="text-sm text-gray-600">
              {story.role}
              {story.institution && ` at ${story.institution}`}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <div className="relative">
          <Quote className="h-8 w-8 text-blue-100 absolute -top-1 -left-2 opacity-50" />
          <p className="text-gray-600 italic relative z-10 pl-6">
            "{story.story}"
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 text-sm text-gray-500">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Shared on {formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

const S2PCommunity: React.FC = () => {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form setup
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      name: "",
      role: "",
      institution: "",
      story: "",
      image: "",
    },
  });
  
  // Fetch approved community stories
  const { data: stories = [], isLoading, refetch } = useQuery({ 
    queryKey: ['/api/cms/community-stories'],
    queryFn: getQueryFn({ on401: "returnNull" })
  });
  
  // Form submission handler
  const onSubmit = async (values: StoryFormValues) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest('/api/cms/community-stories/submit', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      
      toast({
        title: "Story submitted successfully",
        description: "Thank you for sharing your story! It will be reviewed by our team.",
      });
      
      form.reset();
      setIsSubmitDialogOpen(false);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <DocumentHead
        title="S2P Community - Share Your Success Story"
        description="Join the S2P (Student to Professional) Community at Tarcin Robotic. Share your success story and learn from others in the field of robotics, IoT, and AI."
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
          <h1 className="text-3xl font-bold mb-4">S2P Community</h1>
          <p className="text-blue-100 max-w-2xl">
            Student to Professional (S2P) is our community of innovators, researchers, and practitioners
            who are transforming ideas into real-world solutions. Share your journey and inspire others.
          </p>
        </div>
      </section>
      
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-blue-900 mb-6">Join Our Community</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            The Student to Professional (S2P) community brings together academics, industry professionals, and enthusiasts
            who are passionate about turning scientific research into practical applications. Share your success story
            and be part of this growing network.
          </p>
          <Button 
            size="lg" 
            className="bg-blue-700 hover:bg-blue-800"
            onClick={() => setIsSubmitDialogOpen(true)}
          >
            <User className="mr-2 h-5 w-5" />
            Share Your Story
          </Button>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Community Stories</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Read inspiring stories from our community members who have successfully implemented
            Tarcin Robotic's technologies or collaborated with our team on innovative projects.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map(i => (
              <Card key={i} className="h-[300px] animate-pulse">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gray-200" />
                    <div>
                      <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-40" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="h-4 bg-gray-200 rounded w-32" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {stories.map((story: CommunityStory) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Quote className="h-16 w-16 text-blue-200 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Be the first to share your story</h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              No stories have been shared yet. Share your experience with Tarcin Robotic's
              technologies and inspire others in the community.
            </p>
            <Button 
              onClick={() => setIsSubmitDialogOpen(true)}
              className="bg-blue-700 hover:bg-blue-800"
            >
              Share Your Story
            </Button>
          </div>
        )}
      </section>
      
      {/* Share Your Story Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-900">Share Your Story</DialogTitle>
            <DialogDescription>
              Tell us about your experience with Tarcin Robotic's technologies and how they've
              helped you achieve your goals. Your story will be reviewed before being published.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role/Profession*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Research Scientist, Engineer, Student" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution/Company (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Where you work or study" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="story"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Story*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share how you've used our technologies and what results you achieved..." 
                        className="min-h-[150px]"
                        {...field} 
                      />
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
                    <FormLabel>Profile Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="url" 
                        placeholder="https://example.com/your-image.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSubmitDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-700 hover:bg-blue-800"
                >
                  {isSubmitting ? "Submitting..." : "Submit Story"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* <CommunityForum /> */}

    </>
  );
};

export default S2PCommunity;
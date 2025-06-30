import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, Search } from "lucide-react";
import DocumentHead from "@/components/shared/DocumentHead";
import { format, parseISO } from "date-fns";

interface Event {
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

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  // Format date
  const formattedDate = format(parseISO(event.date), "MMM d, yyyy");
  const formattedEndDate = event.endDate ? format(parseISO(event.endDate), "MMM d, yyyy") : null;
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300">
      {event.image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>
            {formattedDate}
            {formattedEndDate && ` - ${formattedEndDate}`}
          </span>
        </div>
        <CardTitle className="text-xl font-bold hover:text-blue-800 transition-colors">
          {event.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{event.location}</span>
        </div>
        <p className="text-gray-600 line-clamp-3">{event.description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        {event.registrationLink ? (
          <a 
            href={event.registrationLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button variant="default" className="w-full">
              {event.isUpcoming ? "Register Now" : "View Details"}
            </Button>
          </a>
        ) : (
          <Button variant="outline" disabled className="w-full">
            {event.isUpcoming ? "Registration Coming Soon" : "View Details"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const Events: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch all events
  const { data: events = [], isLoading } = useQuery<Event[]>({ 
    queryKey: ['/api/cms/events'],
    queryFn: getQueryFn({ on401: "returnNull" })
  });
  console.log("Fetched Events:",events)
  
  // Separate upcoming and past events
  const upcomingEvents = events.filter((event: any) => event.isUpcoming);
  const pastEvents = events.filter((event: any) => !event.isUpcoming);
  
  // Filter events based on search query
  const filteredUpcomingEvents = upcomingEvents.filter((event: any) => 
    searchQuery === "" || 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPastEvents = pastEvents.filter((event: any) => 
    searchQuery === "" || 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Content to show when no events match the filters
  const noEventsContent = (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium mb-2">No events found</h3>
      <p className="text-gray-600 mb-4">
        Try adjusting your search criteria or check back later for new events.
      </p>
      <Button onClick={() => setSearchQuery("")}>
        Clear search
      </Button>
    </div>
  );
  
  return (
    <>
      <DocumentHead
        title="Events - Workshops, Webinars & Conferences"
        description="Join Tarcin Robotic's events, workshops, webinars, and conferences. Stay updated with the latest in robotics, IoT, and AI technology."
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
          <h1 className="text-3xl font-bold mb-4">Events</h1>
          <p className="text-blue-100 max-w-2xl">
            Join us at our upcoming events, workshops, and conferences to learn about the latest advancements
            in robotics, IoT, and AI technologies. Connect with industry experts and like-minded professionals.
          </p>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search events by title, description or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 font-medium">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {upcomingEvents.length} Upcoming Events
            </Badge>
          </div>
        </div>
        
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="h-[350px] animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </CardContent>
                    <CardFooter>
                      <div className="h-10 bg-gray-200 rounded w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredUpcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpcomingEvents.map((event: Event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              noEventsContent
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="h-[350px] animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </CardContent>
                    <CardFooter>
                      <div className="h-10 bg-gray-200 rounded w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredPastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPastEvents.map((event: Event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              noEventsContent
            )}
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export default Events;
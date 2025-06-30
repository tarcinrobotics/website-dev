import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, ChevronRight, MapPin, Search } from "lucide-react";
import DocumentHead from "@/components/shared/DocumentHead";
import { format, parseISO } from "date-fns";
import ResumeUploadSection from "@/components/careers/ResumeUpload";

interface Career {
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

const CareerItem: React.FC<{ career: Career }> = ({ career }) => {
  // Format date
  const formattedDate = format(parseISO(career.postedDate), "MMM d, yyyy");
  
  return (
    <Card className="overflow-hidden border-blue-100 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-blue-50 text-blue-800 mb-2">
            {career.department}
          </Badge>
          <Badge variant={career.isActive ? "default" : "purple"} className="mb-2">
            {career.isActive ? "Active" : "Closed"}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-blue-900">{career.title}</CardTitle>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mt-2">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{career.location}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Posted on {formattedDate}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-b-0">
            <AccordionTrigger className="py-2 text-blue-600 hover:text-blue-800 font-medium text-sm">
              View Details
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
                  <p className="text-gray-600">{career.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    {career.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t border-gray-100">
        {career.isActive ? (
          career.applicationLink ? (
            <a 
              href={career.applicationLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="default" className="w-full">
                Apply Now <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          ) : (
            <Button disabled className="w-full">
              Application Coming Soon
            </Button>
          )
        ) : (
          <Button disabled variant="outline" className="w-full">
            Position Filled
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const Careers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  
  // Fetch career listings
  const { data: careers = [], isLoading } = useQuery({ 
    queryKey: ['/api/cms/careers'],
    queryFn: getQueryFn({ on401: "returnNull" })
  });
  
  // Get unique departments and locations for filters
  const departments = ["all", ...Array.from(new Set((careers as Career[]).map((career: Career) => career.department)))];
  const locations = ["all", ...Array.from(new Set((careers as Career[]).map((career: Career) => career.location)))];
  
  // Filter careers based on search query, department, and location
  const filteredCareers = (careers as Career[]).filter((career: Career) => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by department
    const matchesDepartment = departmentFilter === "all" || career.department === departmentFilter;
    
    // Filter by location
    const matchesLocation = locationFilter === "all" || career.location === locationFilter;
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });
  
  // Sort careers by active status and then by posted date (newest first)
  const sortedCareers = [...filteredCareers].sort((a, b) => {
    // Sort by active status first
    if (a.isActive !== b.isActive) {
      return a.isActive ? -1 : 1;
    }
    // Then sort by posted date (newest first)
    return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
  });
  
  // Content to show when no careers match the filters
  const noCareersContent = (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium mb-2">No career openings found</h3>
      <p className="text-gray-600 mb-4">
        Try adjusting your search criteria or check back later for new opportunities.
      </p>
      <Button onClick={() => {
        setSearchQuery("");
        setDepartmentFilter("all");
        setLocationFilter("all");
      }}>
        Clear filters
      </Button>
    </div>
  );
  
  return (
    <>
      <DocumentHead
        title="Careers at Tarcin Robotic"
        description="Join our innovative team at Tarcin Robotic. Explore career opportunities in robotics, AI, IoT, and more. Shape the future of technology with us."
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
          <h1 className="text-3xl font-bold mb-4">Careers</h1>
          <p className="text-blue-100 max-w-2xl">
            Join our team of innovative minds working on cutting-edge robotics, IoT, and AI solutions.
            We're looking for passionate individuals to help shape the future of technology.
          </p>
        </div>
      </section>
      
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <Briefcase className="h-16 w-16 text-blue-700 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-blue-900 mb-4">Why Join Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Innovation</h3>
              <p className="text-gray-600">
                Work on cutting-edge technologies that are shaping industries and transforming lives.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Growth</h3>
              <p className="text-gray-600">
                Continuous learning opportunities, career advancement, and professional development.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Impact</h3>
              <p className="text-gray-600">
                Make a real difference by creating solutions to some of the world's most challenging problems.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">Current Openings</h2>
        
        <div className="max-w-5xl mx-auto">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search positions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select 
              value={departmentFilter} 
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={locationFilter} 
              onValueChange={setLocationFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc}>
                    {loc === "all" ? "All Locations" : loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Career Listings */}
          <div className="space-y-6">
            {isLoading ? (
              <>
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-200 rounded w-1/4" />
                        <div className="h-6 bg-gray-200 rounded w-16" />
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mt-3" />
                      <div className="flex gap-4 mt-3">
                        <div className="h-4 bg-gray-200 rounded w-1/5" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-10 bg-gray-200 rounded" />
                    </CardContent>
                    <CardFooter className="bg-gray-50">
                      <div className="h-10 bg-gray-200 rounded w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </>
            ) : sortedCareers.length > 0 ? (
              <>
                {sortedCareers.map((career: Career) => (
                  <CareerItem key={career.id} career={career} />
                ))}
              </>
            ) : (
              noCareersContent
            )}
          </div>
        </div>
      </section>
      
      <ResumeUploadSection />
      {/* <section className="bg-blue-900 text-white py-16 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Don't See a Position That Fits?</h2>
          <p className="text-blue-100 mb-8">
            We're always looking for exceptional talent. Send us your resume, and we'll keep you in mind for future opportunities.
          </p>
          <Button size="lg" variant="outline" className="border-white text-white bg-blue-600 hover:bg-blue-800 hover:text-white">
            Submit Your Resume
          </Button>
        </div>
      </section> */}
    </>
  );
};

export default Careers;
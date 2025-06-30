import React from "react";
import { useState } from "react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Users, Award, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import DocumentHead from "@/components/shared/DocumentHead";
import CTASection from "@/components/home/CTASection";
import Newsletter from "@/components/home/Newsletter";
import { fadeUpVariants, staggerContainerVariants } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { coursesData } from "../data/courseDetails";  
import { symbol } from "zod";


const CourseDetail: React.FC = () => {
  const [, params] = useRoute<{ id: string }>("/courses/:id");
  const courseId = params?.id || "";
  const course = coursesData[courseId as keyof typeof coursesData];
  const { elementRef, isVisible } = useScrollAnimation();

   const openPDF = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

   const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  // If course doesn't exist, show a message
  if (!course) {
    return (
      <>
        <DocumentHead
          title="Course Not Found | Tarcin Robotic LLP"
          description="The requested course could not be found."
        />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
          <p className="mb-8">The course you're looking for doesn't exist or may have been removed.</p>
          <Link href="/courses">
            <Button>Browse All Courses</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <DocumentHead
        title={`${course.title} | Tarcin Robotic LLP`}
        description={course.description}
        ogTitle={`${course.title} - Training & Education`}
        ogDescription={course.description}
      />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="1" height="1" fill="white" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
<Link
  href="/courses"
  className="inline-flex items-center bg-white text-blue-600 font-semibold px-5 py-2 rounded-2xl shadow border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 gap-2 mb-4"
>
  <ArrowLeft className="h-4 w-4" />
  Back to all courses
</Link>

          
          <div className="pt-2 max-w-4xl">
            <motion.h1
              className="text-3xl md:text-5xl font-heading font-bold mb-4"
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
            >
              {course.title}
            </motion.h1>
            
            <motion.p
              className="text-xl text-white/90 mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              custom={1}
            >
              {course.description}
            </motion.p>
            
            <motion.div
              className="flex flex-wrap gap-4 mb-8"
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              custom={2}
            >
              <div className="flex items-center text-white/80">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Duration: {course.duration}</span>
              </div>
              
              <div className="flex items-center text-white/80">
                <Award className="h-5 w-5 mr-2" />
                <span>Level: {course.level}</span>
              </div>
              
              <div className="flex items-center text-white/80">
                <Users className="h-5 w-5 mr-2" />
                <span>{course.students} Students</span>
              </div>
              
              <div className="flex items-center text-white/80">
                <Globe className="h-5 w-5 mr-2" />
                <span>Category: {course.category}</span>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              custom={3}
            >
<div className="flex flex-wrap gap-2">
 <a href="https://docs.google.com/forms/d/e/1FAIpQLScx_4em4gjbVOU4vI01r-jr9L0k0hShi-NG7VifyyKCNc9M-Q/viewform?usp=header">
  <Button
    size="lg"
    className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-2xl shadow-lg border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2"
  >
    Enroll Now
  </Button>
  </a>
  {/* <Button
    size="lg"
    className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-2xl shadow-lg border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2"
  >
    Download Syllabus
  </Button> */}
  <Button
  size="lg"
  onClick={() => openPDF(course.syllabus)}
  className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-2xl shadow-lg border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2"
>
  Download Syllabus
</Button>

</div> 


            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Course Content */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                <div className="mb-8">
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                    About This Course
                  </h2>
                  
                  <div 
                    className="prose prose-blue max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: course.fullDescription }}
                  />
                </div>
                
                <div className="mb-8">
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                    What You'll Learn
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mr-3">
                          <span className="text-blue-600 dark:text-blue-400">✓</span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                    Course Content
                  </h2>
                  
                  <div className="space-y-4">
                    {course.modules.map((module, moduleIndex) => (
                      <div 
                        key={moduleIndex}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                      >
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 font-heading font-semibold">
                          Module {moduleIndex + 1}: {module.title}
                        </div>
                        <div className="p-4">
                          <ul className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <li key={lessonIndex} className="flex items-center">
                                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm mr-3">
                                  {lessonIndex + 1}
                                </span>
                                <span className="text-gray-700 dark:text-gray-300">{lesson}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                    Frequently Asked Questions
                  </h2>
                  
                  {/* <div className="space-y-4">
                    {course.faqs.map((faq, index) => (
                      <div 
                        key={index}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                      >
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 font-heading font-semibold">
                          {faq.question}
                        </div>
                        <div className="p-4 text-gray-700 dark:text-gray-300">
                          {faq.answer}
                        </div>
                      </div>
                    ))}
                  </div> */}
                    <div className="space-y-4">
      {course.faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full text-left p-4 bg-gray-50 dark:bg-gray-900 font-heading font-semibold flex justify-between items-center"
          >
            {faq.question}
            <i
              className={`ri-arrow-${openIndex === index ? "up" : "down"}-s-line text-gray-400 dark:text-gray-500 text-xl transition-transform duration-300`}
            ></i>
          </button>

          {openIndex === index && (
            <div className="p-4 text-gray-700 dark:text-gray-300">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-md sticky top-24">
                <div className="mb-6">
                  <img 
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {course.price}
                  </div>
                </div>   
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScx_4em4gjbVOU4vI01r-jr9L0k0hShi-NG7VifyyKCNc9M-Q/viewform?usp=header">
                <Button className="w-full mb-4 text-white bg-blue-600 hover:bg-blue-700">
                  Enroll Now
                </Button>
                </a>
               <Button
  variant="outline"
  onClick={() => openPDF(course.syllabus)}
  className="w-full mb-6 text-white bg-blue-600 hover:bg-blue-700 hover:text-white"
>
  Download Syllabus
</Button>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Level</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Students</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{course.students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Rating</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{course.rating}/5</span>
                  </div>
                </div>
                
                <hr className="my-6 border-gray-200 dark:border-gray-700" />
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Need Help?</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Contact our education team for more information about this course and enrollment options.</p>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full  text-white bg-blue-600 hover:bg-blue-700 hover:text-white">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <CTASection />
      <Newsletter />
    </>
  );
};

export default CourseDetail;
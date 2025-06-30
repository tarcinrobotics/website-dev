import React from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { fadeUpVariants } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const CompanyMission: React.FC = () => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.2,
  });

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50 overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
        {/* Row 1: Vision and Mission side by side */}
        <div
          ref={elementRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start"
        >
          {/* Left: Our Vision */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeUpVariants}
            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500"
          >
            <div className="text-sm text-blue-700 font-medium uppercase mb-2">
              Our Vision
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Empowering Communities Through Sustainable Innovation
            </h3>
            <p className="text-gray-700">
              We envision a future where technology is thoughtfully engineered to uplift regional communities—
              making education, sustainability, and accessibility cornerstones of inclusive progress across Tamil Nadu and Southern India.
            </p>
          </motion.div>

          {/* Right: Our Mission */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeUpVariants}
            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500"
          >
            <div className="text-sm text-blue-700 font-medium uppercase mb-2">
              Our Mission
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Building Sustainable Technology for Regional Impact
            </h3>
            <p className="text-gray-700">
              At Tarcin Robotic LLP, we’re committed to creating technology solutions that solve real-world problems while focusing on education,
              sustainability, and accessibility. Our approach balances innovation with practical execution.
            </p>
          </motion.div>
        </div>

 {/* Row 2: Image (left) and Core Values (right) */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
  {/* Image - Left side on desktop, full width first on mobile */}
  <motion.div
    initial="hidden"
    animate={isVisible ? "visible" : "hidden"}
    variants={fadeUpVariants}
    className="w-full h-full rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition duration-300 order-1 md:order-none"
  >
    <img
      src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
      alt="Tarcin Robotic Collaboration"
      className="object-cover w-full h-full"
    />
  </motion.div>

 {/* Core Values - Right side */}
<motion.div
  initial="hidden"
  animate={isVisible ? "visible" : "hidden"}
  variants={fadeUpVariants}
  className="space-y-10 w-full"  // full width container with vertical spacing
>
  {/* Use flex-col instead of grid for vertical stacking */}
  <div className="flex flex-col gap-6 w-full">
    
    {/* Each item takes full width and is flex row */}
    <div className="flex gap-4 items-start w-full">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xl flex-shrink-0">
        <i className="ri-focus-3-line"></i>
      </div>
      <div className="flex-1"> {/* flex-1 makes this div take remaining width */}
        <h4 className="font-semibold text-gray-900">Execution-Driven Innovation</h4>
        <p className="text-gray-700 text-sm">
          Building practical solutions with real-world applications rather than theoretical concepts.
        </p>
      </div>
    </div>

    <div className="flex gap-4 items-start w-full">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xl flex-shrink-0">
        <i className="ri-earth-line"></i>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">Regional Focus</h4>
        <p className="text-gray-700 text-sm">
          Creating technology for Tamil Nadu and Southern India.
        </p>
      </div>
    </div>

    <div className="flex gap-4 items-start w-full">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xl flex-shrink-0">
        <i className="ri-team-line"></i>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">Community Development</h4>
        <p className="text-gray-700 text-sm">
          Mentoring students and developing the S2P Community for real-world readiness.
        </p>
      </div>
    </div>
  </div>

  <div className="pt-6 w-full">
    <Link href="/about">
      <Button
        variant="default"
        className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg shadow-md"
      >
        Learn More About Us
      </Button>
    </Link>
  </div>
</motion.div>

</div>

      </div>
    </section>
  );
};

export default CompanyMission;





// import React from "react";
// import { motion } from "framer-motion";
// import { useScrollAnimation } from "@/hooks/use-scroll-animation";
// import { fadeUpVariants } from "@/lib/animations";
// import { Button } from "@/components/ui/button";
// import { Link } from "wouter";

// const CompanyMission: React.FC = () => {
//   const { elementRef, isVisible } = useScrollAnimation({
//     threshold: 0.2,
//   });

//   return (
//     <section className="py-16 md:py-24 bg-white relative overflow-hidden">
//       {/* Background decorative elements */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-[100px] opacity-70"></div>
//         <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-blue-50 to-transparent rounded-tr-[200px] opacity-50"></div>
//       </div>
      
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         <div 
//           ref={elementRef as React.RefObject<HTMLDivElement>}
//           className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
//         >
//           {/* Image/Visual Section */}
//           <motion.div
//             initial="hidden"
//             animate={isVisible ? "visible" : "hidden"}
//             variants={fadeUpVariants}
//             className="relative rounded-xl overflow-hidden shadow-xl"
//           >
//             <div className="relative h-[400px] w-full overflow-hidden rounded-xl shadow-inner">
//               <img 
//                 src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
//                 alt="Tarcin Robotic Team Collaboration" 
//                 className="absolute inset-0 w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900/70"></div>
              
//               <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
//                 <h3 className="text-xl font-bold mb-2">Founded in 2021</h3>
//                 <p className="text-sm text-white/90">
//                   Based in Tamil Nadu, with a focus on bringing deep-tech innovation to education and industry.
//                 </p>
//               </div>
//             </div>
//           </motion.div>
          
//           {/* Content Section */}
//           <motion.div
//             initial="hidden"
//             animate={isVisible ? "visible" : "hidden"}
//             variants={fadeUpVariants}
//             custom={1}
//             className="space-y-6"
//           >
//             <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold">
//               Our Mission
//             </div>
            
//             <h2 className="text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
//               Building Sustainable Technology for Regional Impact
//             </h2>
            
//             <p className="text-lg text-gray-700">
//               At Tarcin Robotic LLP, we're committed to creating technology solutions that address real-world problems while focusing on education, sustainability, and accessibility. Our approach balances innovation with practical execution.
//             </p>
            
//             <div className="space-y-4 pt-2">
//               <div className="flex items-start">
//                 <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-4">
//                   <i className="ri-focus-3-line text-xl"></i>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">Execution-Driven Innovation</h3>
//                   <p className="text-gray-700">Building practical solutions with real-world applications rather than theoretical concepts.</p>
//                 </div>
//               </div>
              
//               <div className="flex items-start">
//                 <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-4">
//                   <i className="ri-earth-line text-xl"></i>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">Regional Focus</h3>
//                   <p className="text-gray-700">Creating technology adaptations and products specifically designed for Tamil Nadu and Southern India.</p>
//                 </div>
//               </div>
              
//               <div className="flex items-start">
//                 <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-4">
//                   <i className="ri-team-line text-xl"></i>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">Community Development</h3>
//                   <p className="text-gray-700">Building the S2P Community and mentoring students toward professional skill development.</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="pt-4">
//               <Link href="/about">
//                 <Button 
//                   variant="default" 
//                   className="px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-md"
//                 >
//                   Learn More About Us
//                 </Button>
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CompanyMission;
import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile, useBreakpoint, BREAKPOINTS } from "@/hooks/use-mobile";
import logo from "@/assets/tarcinblue.png";

const SimpleNavbar: React.FC = () => {
  const { t } = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = React.useState(false);
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();
  
  // Handle scroll event for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when changing routes
  const handleNavigation = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  
  // Close mobile menu when screen size changes
  useEffect(() => {
    if (breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === 'xxl') {
      setMobileMenuOpen(false);
    }
  }, [breakpoint]);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  // Animation variants
  const navbarVariants = {
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 100
      }
    },
    hidden: { 
      opacity: 0, 
      y: -25,
      transition: { 
        duration: 0.3,
        type: "spring"
      }
    }
  };
  
  const mobileMenuVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  };
  
  const menuItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    closed: {
      y: -15,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };
  
  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 ${
        scrolled ? 'bg-deep-navy backdrop-blur-sm shadow-md' : 'bg-deep-navy'
        // scrolled ? 'bg-white backdrop-blur-sm shadow-md' : 'bg-white'
      } transition-all duration-300`}
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <div className=" max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}

<motion.div 
  className="flex items-center"
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5 }}
>
  <a href="/">
    <div className="flex-shrink-0 flex items-center cursor-pointer">
      <img
        src={logo}// ✅ Correct image path (place logo.png inside the /public folder)
        alt="Tarcin Logo"
        className="h-20 w-auto max-w-[180px] object-contain drop-shadow-md"
      />
    </div>
  </a>
</motion.div>
          
          {/* Desktop Nav Links */}
          <div className="hidden  lg:flex lg:items-center lg:space-x-4 ">
            {[
              { path: '/', label: 'Home' },
              { path: '/about', label: 'About' },
              { path: '/services', label: 'Services' },
              { path: '/products', label: 'Products' },
              { path: '/courses', label: 'Courses' },
              { path: '/blog', label: 'Blog' },
              { path: '/events', label: 'Events' },
              { path: '/careers', label: 'Careers' },
              { path: '/s2p-community', label: 'S2P Community' },
              // { path: '/contact', label: t("nav.contact") }
            ].map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
              >
                <Link href={item.path}>
                  <div 
                    onClick={handleNavigation} 
                    className={`px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                      isActive(item.path) 
                        ? 'text-white bg-blue-800 rounded-md' 
                        : 'text-white hover:text-white hover:bg-blue-800 hover:bg-opacity-70 rounded-md'
                    }`}
                  >
                    {item.label}
                  </div>
                </Link>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Link href="/contact">
                <Button 
                  onClick={handleNavigation}
                  className="ml-4 bg-white text-blue-800 hover:bg-blue-800  hover:text-white font-bold shadow-md border border-blue-800"
                >
                  {t("nav.getInTouch")} Contact Us
                </Button>
              </Link>
            </motion.div>
          </div>

          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-expanded={mobileMenuOpen}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Toggle menu</span>
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6 " aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu with AnimatePresence for enter/exit animations */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav 
            className="lg:hidden bg-blue-800 shadow-lg overflow-hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <motion.div className="pt-2 pb-4 space-y-1 px-4">
              {[
                { path: '/', label: 'Home' },
                { path: '/about', label: 'About' },
                { path: '/services', label: 'Services'},
                { path: '/products', label: 'Products' },
                { path: '/courses', label: 'Courses' },
                { path: '/blog', label: 'Blog' },
                { path: '/events', label: 'Events' },
                { path: '/careers', label: 'Careers' },
                { path: '/s2p-community', label: 'S2P Community' },
                // { path: '/contact', label: t("nav.contact") }
              ].map((item) => (
                <motion.div key={item.path} variants={menuItemVariants}>
                  <Link href={item.path}>
                    <div 
                      onClick={handleNavigation} 
                      className={`block px-4 py-2 rounded-md ${
                        isActive(item.path) 
                          ? 'bg-blue-700 text-white' 
                          : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                      } font-medium cursor-pointer transition-colors`}
                    >
                      {item.label}
                    </div>
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={menuItemVariants} className="pt-2">
                <Link href="/contact">
                  <Button 
                    onClick={handleNavigation}
                    className="w-full bg-white hover:bg-blue-50 text-blue-900 font-bold shadow-md border border-white"
                  >
                    {t("nav.getInTouch")} Contact US
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default SimpleNavbar;
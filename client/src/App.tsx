import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SimpleNavbar from "@/components/layout/SimpleNavbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Products from "@/pages/Products";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import ProductDetail from "@/pages/ProductDetail";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Events from "@/pages/Events";
import Careers from "@/pages/Careers";
import S2PCommunity from "@/pages/S2PCommunity";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import BlogManagement from "@/pages/admin/blog";
import EventsManagement from "@/pages/admin/events";
import CareersManagement from "@/pages/admin/careers";
import CommunityManagement from "@/pages/admin/community";
import AdminSettings from "@/pages/admin/Settings";
import NotFound from "@/pages/not-found";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import PrivacyPolicy from "./components/legal_policy/PrivacyPolicy";
import TermsOfService from "./components/legal_policy/TermsOfService";
import CookiePolicy from "./components/legal_policy/CookiePolicy"
import ServicesSection from "./components/services/ServicesSection";
import Navbar from "./components/layout/Navbar"


function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');
  
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/service-section" component={ServicesSection } />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetail} />
      <Route path="/contact" component={Contact} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/events" component={Events} />
      <Route path="/careers" component={Careers} />
      <Route path="/s2p-community" component={S2PCommunity} />

      <Route path="/privacy-policy" component = {PrivacyPolicy} />
      <Route path="/terms-of-service" component = {TermsOfService} />
      <Route path="/cookie-policy" component = {CookiePolicy} />

      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <ProtectedRoute path="/admin/dashboard">
        <AdminDashboard />
      </ProtectedRoute>
      <ProtectedRoute path="/admin/blog">
        <BlogManagement />
      </ProtectedRoute>
      <ProtectedRoute path="/admin/events">
        <EventsManagement />
      </ProtectedRoute>
      <ProtectedRoute path="/admin/careers">
        <CareersManagement />
      </ProtectedRoute>
      <ProtectedRoute path="/admin/community">
        <CommunityManagement />
      </ProtectedRoute>
      <ProtectedRoute path="/admin/settings">
        <AdminSettings />
      </ProtectedRoute>
      <Route path="/admin-secret" component={() => {
        window.location.href = "/admin/login";
        return null;
      }} />
      
      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminAuthProvider>
          <Toaster />
          {isAdminRoute ? (
            // Admin routes don't need the main layout
            <Router />
          ) : (
            // Public routes use the main layout
            <div className="flex flex-col min-h-screen bg-white">
              {/* <SimpleNavbar /> */}
              <Navbar />
              
              <main className="flex-grow">
                 <ScrollToTop /> 
                <Router />
              </main>
              <Footer />
            </div>
          )}
        </AdminAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

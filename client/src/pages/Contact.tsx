import React, { useState } from "react";
import DocumentHead from "@/components/shared/DocumentHead";
import ContactSection from "@/components/contact/ContactSection";
import Newsletter from "@/components/home/Newsletter";
import { motion } from "framer-motion";
import { fadeUpVariants } from "@/lib/animations";

const faqs = [
  {
    question: "What types of educational institutions do you work with?",
    answer:
      "We work with a diverse range of educational institutions across Tamil Nadu, including K-12 schools, engineering colleges, polytechnics, and vocational training centers. Our solutions are tailored to meet the specific curriculum and skill development needs of each institution.",
  },
  {
    question: "How can I schedule a demonstration of Code Asthram?",
    answer:
      "Educational institutions can schedule a demonstration of our Code Asthram platform by filling out the contact form on this page, or by emailing directly to info@tarcinrobotic.com. Our team will arrange either an on-site demo at your institution or an online session, typically within 3-5 business days.",
  },
  {
    question: "Do you offer implementation and support services?",
    answer:
      "Yes, we provide comprehensive implementation services for all our educational solutions. This includes initial setup, customization for your specific curriculum needs, and ongoing technical support. We also offer teacher training sessions to ensure your staff can effectively utilize our platforms in their teaching.",
  },
  {
    question: "What kind of training do you provide for educators?",
    answer:
      "We provide comprehensive training for educators that includes platform navigation, curriculum implementation strategies, assessment techniques, and classroom management using our tools. Our training programs are conducted through interactive workshops, online sessions, and reference materials. We also offer refresher courses and advanced training as your staff becomes more familiar with our platforms.",
  },
  {
    question: "Can your educational platforms integrate with our existing school systems?",
    answer:
      "Yes, our Code Asthram platform is designed with interoperability in mind. It can integrate with common learning management systems, student information systems, and other educational tools using standard protocols. We also offer custom integration services for specialized systems common in Tamil Nadu educational institutions. Our implementation team will assess your existing infrastructure and develop an integration plan tailored to your needs.",
  },
];

const Contact: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <DocumentHead
        title="Contact Us | Tarcin Robotic LLP"
        description="Get in touch with Tarcin Robotic LLP for inquiries about our educational platforms, IoT devices, or collaboration opportunities. We're here to help."
        ogTitle="Contact Tarcin Robotic LLP"
        ogDescription="Reach out to our team about Code Asthram, S2P Community, or our technological solutions for educational institutions in Tamil Nadu."
      />

      {/* Hero Banner */}
      <section className="mt-20 pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
       
       <div className="absolute inset-0 opacity-20 animate-wave">
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="wave-lines" width="100" height="40" patternUnits="userSpaceOnUse" patternTransform="translate(0, 0)">
        <path d="M 0 20 Q 25 0, 50 20 T 100 20" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#wave-lines)" />
  </svg>
</div>

<style>
{`
  @keyframes waveMove {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100px);
    }
  }

  .animate-wave svg {
    animation: waveMove 5s linear infinite;
  }
`}
</style>


        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
            >
              Get in Touch
            </motion.h1>
            <motion.p
              className="text-base md:text-xl text-white/90 mb-8"
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              custom={1}
            >
              Have questions about our educational platforms, training programs, or how we can support your institution? Our team is ready to help.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactSection />

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find quick answers to common questions about our educational platforms and implementation process.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-gray-700">
            {faqs.map((faq, index) => (
              <div key={index} className="py-6">
                <button
                  className="flex justify-between items-center w-full text-left"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <i
                    className={`ri-arrow-${openIndex === index ? "up" : "down"}-s-line text-gray-400 dark:text-gray-500 text-xl transition-transform duration-300`}
                  ></i>
                </button>
                {openIndex === index && (
                  <div className="mt-3 text-gray-600 dark:text-gray-300">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors wave-btn"
            >
              Still have questions? Contact us
            </a>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
};

export default Contact;

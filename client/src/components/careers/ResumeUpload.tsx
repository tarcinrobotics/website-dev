// ResumeUploadSection.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust path based on your project
import axios from "axios";

const ResumeUploadSection: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!resume) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    try {
       await axios.post("/api/resume-upload", formData, {

        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Resume submitted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to upload resume. Try again.");
    }
  };

  return (
    <section className="bg-blue-900 text-white py-16 text-center">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold mb-6">Don't See a Position That Fits?</h2>
        <p className="text-blue-100 mb-8">
          We're always looking for exceptional talent. Upload your resume, and we'll keep you in mind for future opportunities.
        </p>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="mb-4 block mx-auto"
        />

        <Button
          size="lg"
          variant="outline"
          className="border-white text-white bg-blue-600 hover:bg-blue-800 hover:text-white"
          onClick={handleSubmit}
        >
          Submit Your Resume
        </Button>

        {message && <p className="mt-4 text-blue-200">{message}</p>}
      </div>
    </section>
  );
};

export default ResumeUploadSection;

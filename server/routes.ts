import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import cmsRoutes from "./cms/apiRoutes";
import contactRoutes from "./cms/apiRoutes";
import newsletterRoutes from "./cms/newsletterRoutes";
import { handleResumeUpload } from "./cms/apiRoutes";
import forumRoutes from "./cms/apiRoutes"

export async function registerRoutes(app: Express): Promise<Server> {
  // CMS routes
  app.use('/api/cms', cmsRoutes);

  // Other application routes can be added here
  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)
    app.use('/api', contactRoutes); // 👈 this allows /api/contact POST

    app.use('/api/newsletter', newsletterRoutes);

    app.post("/api/resume-upload", handleResumeUpload);

    app.use("/api/forum", forumRoutes);


  const httpServer = createServer(app);

  return httpServer;
}




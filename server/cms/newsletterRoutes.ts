import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readJSON, writeJSON } from './dataStorage';
import { addSubscriber, getSubscribers } from './dataStorage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const filePath = path.join(__dirname, 'data', 'subscribers.json');

// Configure mailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const subscribers = readJSON(filePath);
  if (subscribers.find((s: any) => s.email === email)) {
    return res.status(409).json({ message: 'Email already subscribed' });
  }

  const newEntry = { email, subscribedAt: new Date().toISOString() };
  subscribers.push(newEntry);
  writeJSON(filePath, subscribers);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'You are subscribed!',
      html: `<h2>Thank you for subscribing to Tarcin Robotic LLP!</h2>`
    });

    res.status(200).json({ message: 'Subscribed and email sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Saved, but failed to send email.' });
  }
});

export default router;

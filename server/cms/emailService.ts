import nodemailer from 'nodemailer';
import path from 'path';
import { readJSON } from './dataStorage';
import { addSubscriber, getSubscribers } from './dataStorage';


const filePath = path.join(__dirname, 'data', 'subscribers.json');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendNewsletterToAll = async (subject: string, html: string) => {
  const subscribers = readJSON(filePath);
  for (const { email } of subscribers) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html
    });
  }
};

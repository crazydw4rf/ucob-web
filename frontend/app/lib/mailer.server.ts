import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text: string; html: string }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("Email credentials not set. Skipping email send.");
    return;
  }
  return transporter.sendMail({
    from: `"UCOB" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

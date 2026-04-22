// services/email.js

// ================================================================
// MODULE 14 — Sending Emails
// services/email.js
//
// Transactional email functions powered by Nodemailer + SendGrid.
//
// Functions:
//  sendWelcomeEmail        — triggered on user registration
//  sendPasswordResetEmail  — triggered on forgot-password request
//  sendCancellationEmail   — triggered on account deletion
//
// NOTE: Set Gmail values in the .env file.
// App Password format - Remove spaces — abcd efgh ijkl mnop → abcdefghijklmnop 
// From address - Must be your Gmail address, not an arbitrary one 
// Daily limit - Gmail allows ~500 emails/day — fine for training 
// 2FA required - App Passwords only work if 2-Step Verification is on
// ================================================================

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,   // App Password, not your real password
  },
});

export async function sendWelcomeEmail(to, name) {
  console.log("welcome");
  if (!process.env.GMAIL_USER) return;
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject: "Welcome",
    text: "Welcome to the app"
  });
}

export async function sendPasswordResetEmail(to, resetToken) {
  if (!process.env.GMAIL_USER) return;
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
  await transporter.sendMail({
    from: `"Task App" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Password Reset Request',
    text: `Reset your password here: ${resetUrl}\nExpires in 1 hour.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#dc2626;color:#fff;border-radius:6px;text-decoration:none;">
          Reset Password
        </a>
        <p style="color:#6b7280;font-size:14px;">
          This link expires in 1 hour. If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendCancellationEmail(to, name) {
  if (!process.env.GMAIL_USER) return;
  await transporter.sendMail({
    from: `"Task App" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Your Task App account has been deleted',
    text: `Hi ${name}, your account and all associated data have been permanently removed.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2>Account Deleted</h2>
        <p>Hi ${name}, sorry to see you go.</p>
        <p>Your account and all associated tasks have been permanently removed.</p>
      </div>
    `,
  });
}
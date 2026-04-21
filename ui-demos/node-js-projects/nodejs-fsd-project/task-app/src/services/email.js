// ============================================================
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
// NOTE: Set SENDGRID_API_KEY in your .env file.
//       For local testing without SendGrid, swap the transporter
//       for nodemailer.createTransport({ host: 'localhost', port: 1025 })
//       and run a local SMTP server like Mailhog.
// ============================================================

import nodemailer from 'nodemailer';

// ── Transporter ────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});

// ── Welcome Email ──────────────────────────────────────────
export async function sendWelcomeEmail(to, name) {
  await transporter.sendMail({
    from: '"Task App" <noreply@taskapp.com>',
    to,
    subject: `Welcome to Task App, ${name}!`,
    text: `Hi ${name}, thanks for joining Task App! Get started by creating your first task.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h1 style="color: #4f46e5;">Welcome, ${name}!</h1>
        <p>Thanks for joining Task App. Get started by creating your first task.</p>
        <a href="${process.env.APP_URL}/dashboard"
           style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#fff;border-radius:6px;text-decoration:none;">
          Go to Dashboard
        </a>
      </div>
    `,
  });
}

// ── Password Reset Email ───────────────────────────────────
export async function sendPasswordResetEmail(to, resetToken) {
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
  await transporter.sendMail({
    from: '"Task App" <noreply@taskapp.com>',
    to,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Visit: ${resetUrl}\nThis link expires in 1 hour.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to continue:</p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#dc2626;color:#fff;border-radius:6px;text-decoration:none;">
          Reset Password
        </a>
        <p style="color:#6b7280;font-size:14px;">
          This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

// ── Account Cancellation Email ─────────────────────────────
export async function sendCancellationEmail(to, name) {
  await transporter.sendMail({
    from: '"Task App" <noreply@taskapp.com>',
    to,
    subject: 'Your Task App account has been deleted',
    text: `Hi ${name}, sorry to see you go. Your account and all associated data have been permanently removed.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2>Account Deleted</h2>
        <p>Hi ${name}, sorry to see you go.</p>
        <p>Your account and all associated tasks have been permanently removed.</p>
      </div>
    `,
  });
}

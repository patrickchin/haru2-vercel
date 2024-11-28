import nodemailer from "nodemailer";
import { Resend } from "resend";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., "smtp.example.com"
  port: parseInt(process.env.SMTP_PORT || "587", 10), // typically 587 for TLS or 465 for SSL
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmailNodeMailer({
  from,
  to,
  subject,
  body,
}: {
  from: string;
  to: string;
  subject: string;
  body: string;
}) {
  const mailOptions = { from, to, subject, body };
  return new Promise<void>((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function sendEmailResend({
  from,
  to,
  subject,
  body,
}: {
  from: string;
  to: string;
  subject: string;
  body: string;
}) {
  const resend = new Resend(process.env.RESEND_API_TOKEN);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html: body,
  });
  if (error) throw error;
}

export async function sendEmail(args: {
  from: string;
  to: string;
  subject: string;
  body: string;
}) {
  if (true) {
    await sendEmailResend(args);
  } else {
    await sendEmailNodeMailer(args);
  }
}

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., "smtp.example.com"
  port: parseInt(process.env.SMTP_PORT || '587', 10), // typically 587 for TLS or 465 for SSL
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});


export async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    text
  };

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

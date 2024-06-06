"use server";

import { tokenGenerate } from '@vonage/jwt';
import fs from 'fs';
import * as db from './db';
import crypto from 'crypto';
import { saveOtp, verifyOtp } from './db'; // Adjust the import path
import { sendEmail } from './emailService'; // Ensure you have an email service module

// Vonage configuration
const applicationId = process.env.VONAGE_APPLICATION_ID as string;
const fromNumber = process.env.VONAGE_WHATSAPP_FROM_PHONE_NUMBER as string;
const apiUrl = process.env.VONAGE_WHATSAPP_API_URL as string;
const privateKey = process.env.VONAGE_PRIVATE_KEY as string;
const templateName = process.env.VONAGE_TEMPLATE_NAME as string;

const JWT = tokenGenerate(applicationId, privateKey);

// Function to generate OTP
function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Function to send OTP via WhatsApp
export async function sendOtpViaWhatsApp(email: string): Promise<void> {
  const user = await db.getUserAccountByEmail(email);
  if (user.length === 0) {
    throw new Error('No user found with this email.');
  }

  const phoneNumber = user[0].phone;
  if (!phoneNumber) {
    throw new Error('No phone number associated with this email.');
  }
  
  const otp = generateOTP();

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes
  await saveOtp(phoneNumber, otp, expiresAt); // Convert Date to ISO string

  const data = {
    to: phoneNumber,
    from: fromNumber,
    channel: "whatsapp",
    message_type: "custom",
    custom: {
      type: "template",
      template: {
        name: templateName,
        language: {
          policy: "deterministic",
          code: "en"
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: otp
              }
            ]
          },
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [
              {
                type: "text",
                text: otp
              }
            ]
          }
        ]
      }
    }
  };

  if (!apiUrl) throw new Error("Missing Vonage Whatsapp API URL");

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${JWT}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const responseData = await response.json()
    console.log(responseData)
    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData);
      throw new Error(errorData.message || 'Failed to send OTP');
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Failed to send OTP');
    } else {
      console.error('An unknown error occurred');
      throw new Error('An unknown error occurred');
    }
  }
}

// Function to send OTP via email
export async function sendOtpViaEmail(email: string): Promise<void> {
  const user = await db.getUserAccountByEmail(email);
  if (user.length === 0) {
    throw new Error('No user found with this email.');
  }

  const phoneNumber = user[0].phone;
  if (!phoneNumber) {
    throw new Error('No phone number associated with this email.');
  }
  
  const otp = generateOTP();

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes
  await saveOtp(phoneNumber, otp, expiresAt); 

  const subject = "Your OTP Code";
  const text = `Your OTP is: ${otp}`;

  try {
    await sendEmail(email, subject, text);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Failed to send OTP via email');
    } else {
      console.error('An unknown error occurred');
      throw new Error('An unknown error occurred');
    }
  }
}

// Export verifyOtp function
export { verifyOtp };

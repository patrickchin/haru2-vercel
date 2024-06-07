"use server";

import { tokenGenerate } from "@vonage/jwt";
import * as db from "./db";
import crypto from "crypto";
import { saveOtp, verifyOtp } from "./db";
import { sendEmail } from "./emailService";
import { HaruError } from "./types";

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
export async function sendOtpViaWhatsApp(phone: string): Promise<void> {
  const user = await db.getUserAccountByPhone(phone);
  if (user.length === 0) {
    throw new HaruError("UserNotFound");
  }

  const otp = generateOTP();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes
  await saveOtp(phone, otp, expiresAt); // Convert Date to ISO string

  const data = {
    to: phone,
    from: fromNumber,
    channel: "whatsapp",
    message_type: "custom",
    custom: {
      type: "template",
      template: {
        name: templateName,
        language: {
          policy: "deterministic",
          code: "en",
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: otp,
              },
            ],
          },
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [
              {
                type: "text",
                text: otp,
              },
            ],
          },
        ],
      },
    },
  };

  if (!apiUrl) throw new HaruError("ServerConfigurationError");

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    throw new HaruError("FailedToSendWhatsapp");
  }
}

// Function to send OTP via email
export async function sendOtpViaEmail(email: string): Promise<void> {
  const user = await db.getUserAccountByEmail(email);
  if (user.length === 0) {
    throw new HaruError("UserNotFound");
  }

  const otp = generateOTP();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes
  await saveOtp(email, otp, expiresAt);

  const subject = "Your OTP Code";
  const text = `Your OTP is: ${otp}`;

  try {
    await sendEmail(email, subject, text);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new HaruError("FailedToSendEmail");
    } else {
      console.error("An unknown error occurred: ", error);
      throw new HaruError("Unknown");
    }
  }
}

// Export verifyOtp function
export { verifyOtp };

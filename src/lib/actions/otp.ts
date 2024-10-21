"use server";

import { tokenGenerate } from "@vonage/jwt";
import * as db from "../../db";
import crypto from "crypto";
import { saveOtp, verifyOtp } from "../../db";
import { sendEmail } from "../email";
import { FailedToSendEmailOTP, FailedToSendWhatsappOTP } from "../errors";

// Vonage configuration
const applicationId = process.env.VONAGE_APPLICATION_ID as string;
const fromNumber = process.env.VONAGE_WHATSAPP_FROM_PHONE_NUMBER as string;
const apiUrl = process.env.VONAGE_WHATSAPP_API_URL as string;
const privateKey = process.env.VONAGE_PRIVATE_KEY as string;
const templateName = process.env.VONAGE_TEMPLATE_NAME as string;

// Function to generate OTP
function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Function to send OTP via WhatsApp
export async function sendOtpViaWhatsApp(phone: string) {
  try {
    const user = await db.getUserAccountByPhone(phone);
    if (!user) {
      console.log(`Phone number ${phone} not registered`);
      return FailedToSendWhatsappOTP;
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

    if (!apiUrl) {
      console.error(`vonage api url missing ${apiUrl}`);
      // or unknown?
      return FailedToSendWhatsappOTP;
    }

    const JWT = tokenGenerate(applicationId, privateKey);

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
      return FailedToSendWhatsappOTP;
    }
  } catch (error) {
    console.error(`sendOtpViaWhatsApp unkonwn error: ${error}`);
    return FailedToSendWhatsappOTP;
  }
}

// Function to send OTP via email
export async function sendOtpViaEmail(email: string) {
  try {
    const user = await db.getUserAccountByEmail(email);
    if (!user) {
      console.log(`Email number ${email} not registered`);
      return FailedToSendEmailOTP;
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
      console.error(`Failed to send email: ${error}`);
      return FailedToSendEmailOTP;
    }
  } catch (error) {
    console.error(`sendOtpViaEmail unkonwn error: ${error}`);
    return FailedToSendEmailOTP;
  }
}

// Export verifyOtp function
export { verifyOtp };

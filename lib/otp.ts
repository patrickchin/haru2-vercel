import axios from 'axios';
import { tokenGenerate } from '@vonage/jwt';
import fs from 'fs';
import crypto from 'crypto';
import { saveOtp, verifyOtp } from './db'; // Adjust the import path

const privateKeyPath = process.env.VONAGE_PRIVATE_KEY_PATH;
const applicationId = process.env.VONAGE_APPLICATION_ID;
const fromNumber = process.env.VONAGE_WHATSAPP_FROM_PHONE_NUMBER;
const apiUrl = process.env.VONAGE_WHATSAPP_API_URL;

if (!privateKeyPath || !applicationId || !fromNumber || !apiUrl) {
  throw new Error('Missing required environment variables for Vonage configuration.');
}

const privateKey = fs.readFileSync(privateKeyPath, 'utf8'); // Ensure 'utf8' encoding to read as string
const JWT = tokenGenerate(applicationId, privateKey);

function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function sendOtpViaWhatsApp(phoneNumber: string): Promise<void> {
  const otp = generateOTP();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes

  await saveOtp(phoneNumber, otp, expiresAt.toISOString()); // Convert Date to ISO string

  const data = {
    message_type: "text",
    text: `Your OTP is: ${otp}`,
    to: phoneNumber,
    from: fromNumber,
    channel: "whatsapp"
  };

  if (!apiUrl) throw new Error("Missing Vonage Whatsapp API URL");

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        'Authorization': `Bearer ${JWT}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle Axios error with a response
      console.error(error.response.data);
      throw new Error(error.response.data.message || 'Failed to send OTP');
    } else if (error instanceof Error) {
      // Handle generic Error
      console.error(error.message);
      throw new Error('Failed to send OTP');
    } else {
      // Handle unknown error type
      console.error('An unknown error occurred');
      throw new Error('An unknown error occurred');
    }
  }
}

export { verifyOtp };

'use server';

import { signIn } from '@/lib/auth';
import {sendOtpViaWhatsApp} from '@/lib/otp'
import { getUser } from '@/lib/db';

export async function signInAction(formData: FormData, loginMethod: 'password' | 'otp') {
  if (loginMethod === 'password') {
    await signIn('credentials', {
      redirectTo:'/',
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })
  } else {
    await signIn('credentials', {
      redirectTo:'/',
      email: formData.get('email') as string,
      otp: formData.get('otp') as string,
    });
  }
}

// Function to send OTP to a WhatsApp number
export async function sendOtp(email: string) {
  const user = await getUser(email);
  if (user.length === 0) {
    throw new Error('No user found with this email.');
  }

  const phoneNumber = user[0].phone;
    if (!phoneNumber) {
    throw new Error('No phone number associated with this email.');
  }
  await sendOtpViaWhatsApp(phoneNumber);
}

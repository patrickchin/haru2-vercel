import "server-only";

import { db } from "./_db";
import { eq } from "drizzle-orm";
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";

import * as Schemas from "@/drizzle/schema";

export async function saveOtp(
  contactInfo: string,
  otp: string,
  expiresAt: Date,
) {
  // Define the rate limit time window (e.g., 5 seconds between requests)
  const RATE_LIMIT_WINDOW = 5 * 1000;

  // Get the current time
  const currentTime = new Date().getTime();

  // Use a transaction to ensure atomicity and consistency
  return await db.transaction(async (tx) => {
    // Check if there is an existing OTP for the phone number
    const existingOtp = await tx
      .select()
      .from(Schemas.otps1)
      .where(eq(Schemas.otps1.contactInfo, contactInfo))
      .limit(1);

    if (existingOtp.length > 0) {
      const lastOtpTimeValue = existingOtp[0].createdAt;

      // Ensure that lastOtpTimeValue is not null
      if (lastOtpTimeValue !== null) {
        const lastOtpTime = lastOtpTimeValue.getTime(); // Convert to Unix timestamp in milliseconds

        // Calculate the time difference
        const timeDifference = currentTime - lastOtpTime;

        // If the time difference is less than the rate limit window, throw an error
        if (timeDifference < RATE_LIMIT_WINDOW) {
          throw new Error(
            "OTP requests are too frequent. Please try again later.",
          );
        }

        // If allowed, delete the existing OTP (to be overwritten)
        await tx
          .delete(Schemas.otps1)
          .where(eq(Schemas.otps1.contactInfo, contactInfo));
      }
    }

    // Generate a salt and hash the OTP
    const salt = genSaltSync(10);
    const hashedOtp = hashSync(otp, salt);

    // Save the new OTP
    return await tx
      .insert(Schemas.otps1)
      .values({
        contactInfo,
        otp: hashedOtp,
        expiresAt,
        createdAt: new Date(), // Save the current timestamp as an ISO string
      })
      .returning();
  });
}

export async function verifyOtp(
  contactInfo: string,
  otp: string,
): Promise<boolean> {
  return await db.transaction(async (tx) => {
    // Retrieve the OTP record for the given phone number
    const record = await tx
      .select()
      .from(Schemas.otps1)
      .where(eq(Schemas.otps1.contactInfo, contactInfo))
      .limit(1);

    // If no record is found, return false
    if (record.length === 0) {
      return false;
    }

    const { otp: hashedOtp, expiresAt } = record[0];

    // Check if the OTP has expired
    if (new Date() > new Date(expiresAt)) {
      // If expired, delete the OTP record and return false
      await tx
        .delete(Schemas.otps1)
        .where(eq(Schemas.otps1.contactInfo, contactInfo));
      return false;
    }

    // Compare the provided OTP with the hashed OTP
    const isValidOtp = compareSync(otp, hashedOtp);

    // If the OTP is valid, delete the OTP record
    if (isValidOtp) {
      await tx
        .delete(Schemas.otps1)
        .where(eq(Schemas.otps1.contactInfo, contactInfo));
    }

    return isValidOtp;
  });
}

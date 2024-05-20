"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signInAction, sendOtp } from "./signInAction";
import { signInFromLogin } from "@/lib/actions";
import { SimpleLayout } from "@/components/page-layouts";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otpSent, setOtpSent] = useState(false);
  const [resendOtpTimer, setResendOtpTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendOtpTimer > 0) {
      timer = setTimeout(() => setResendOtpTimer(resendOtpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendOtpTimer]);

  // Define schema
  const schema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email(),
    password: z.string().optional(),
    otp: z.string().optional(),
  }).refine((data) => {
    if (loginMethod === 'password') {
      return data.password !== undefined && data.password.length > 0;
    } else if (loginMethod === 'otp') {
      return data.otp !== undefined && data.otp.length > 0;
    }
    return false;
  }, {
    message: "Password or OTP is required based on the selected login method",
    path: ["password", "otp"],
  });

  type FormFields = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      if (loginMethod === 'password') {
        await signInFromLogin({
          redirectTo: "/",
          email: data.email,
          password: data.password || "",
        });
      } else {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("otp", data.otp || "");
        await signInAction(formData, 'otp');
      }
    } catch (err: any) {
      setError('The credentials you entered are incorrect. Please double-check your credentials and try again.');
      setFormError(loginMethod === 'password' ? 'password' : 'otp', { type: 'manual', message: err.message });
    }
  };

  const handleSendOtpClick = async (email: string) => {
    try {
      await sendOtp(email);
      setOtpSent(true);
      setResendOtpTimer(60);
      setError(null); // Clear any existing errors when OTP is sent successfully
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP.');
    }
  };

  return (
    <SimpleLayout>
      <div className="w-screen max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col py-6 space-y-3 bg-background text-center border-b border-border">
          <h3>Login</h3>
          <p>Use your email and password to login</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4 bg-gray-50 px-16 py-6"
        >
          {error && <p className="text-red-600 text-center">{error}</p>}

          <div>
            <Label htmlFor="email" className="text-xs uppercase">
              Email Address
              <Input
                {...register("email")}
                type="email"
                placeholder="user@acme.com"
                autoComplete="email"
                required
                className="text-sm"
              />
            </Label>
            {errors.email && (
              <p className="text-sm font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {loginMethod === 'password' ? (
            <div>
              <Label htmlFor="password" className="text-xs uppercase">
                Password
              </Label>
              <Input
                {...register("password")}
                type="password"
                required
                className="text-sm"
              />
              {errors.password && (
                <p className="text-sm font-medium text-destructive">
                  {errors.password?.message}
                </p>
              )}
            </div>
          ) : (
            <div>
              <Label htmlFor="otp" className="text-xs uppercase">
                OTP
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                  {...register("otp")}
                  type="text"
                  required
                  className="text-sm flex-1"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const email = (e.target as HTMLButtonElement).form?.email?.value;
                    if (email) {
                      handleSendOtpClick(email);
                    } else {
                      setError('Email is required to send OTP.');
                    }
                  }}
                  className={`text-sm bg-blue-600 text-white rounded py-1 px-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 ${resendOtpTimer > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={resendOtpTimer > 0}
                >
                  Send OTP
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                {otpSent && resendOtpTimer > 0 ? (
                  <span className="text-sm text-gray-600">Resend OTP in {resendOtpTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const email = (e.target as HTMLButtonElement).form?.email?.value;
                      if (email) {
                        handleSendOtpClick(email);
                      } else {
                        setError('Email is required to resend OTP.');
                      }
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          <Button className="text-sm" type="submit">
            Login
          </Button>

          <button
            type="button"
            onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')}
            className="text-sm border border-blue-600 text-blue-600 rounded py-2 px-4 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            {loginMethod === 'password' ? 'Login with OTP' : 'Login with Password'}
          </button>

          <p className="text-center text-sm text-gray-600">
            {" Don't have an account? "}
            <Link href="/register" className="font-bold hover:underline">
              {"Sign up"}
            </Link>
            {" for free."}
          </p>
        </form>
      </div>
    </SimpleLayout>
  );
}

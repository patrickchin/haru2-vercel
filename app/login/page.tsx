'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { signInFromLogin } from '@/lib/actions';
import { sendOtpViaWhatsApp, sendOtpViaEmail } from '@/lib/otp';
import { SimpleLayout } from '@/components/page-layouts';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const LoginFormSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: z.string().optional(),
  otp: z.string().optional(),
}).refine((data) => {
  if (!data.password && !data.otp) {
    return false;
  }
  return true;
}, {
  message: 'Password or OTP is required',
  path: ['password'],
});

type FormFields = z.infer<typeof LoginFormSchema>;

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otpSent, setOtpSent] = useState(false);
  const [resendOtpTimer, setResendOtpTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(LoginFormSchema),
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendOtpTimer > 0) {
      timer = setTimeout(() => setResendOtpTimer(resendOtpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendOtpTimer]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setError(null);
    const loginData: any = {
      email: data.email,
      ...(loginMethod === 'password' ? { password: data.password } : { otp: data.otp }),
    };

    try {
      await signInFromLogin(loginData);
    } catch (err: any) {
      setError('The credentials you entered are incorrect. Please double-check your credentials and try again.');
    }
  };

  const handleSendOtpClick = async (email: string, method: 'whatsapp' | 'email') => {
    try {
      if (method === 'whatsapp') {
        await sendOtpViaWhatsApp(email);
      } else {
        await sendOtpViaEmail(email);
      }
      setOtpSent(true);
      setResendOtpTimer(60);
      setError(null); // Clear any existing errors when OTP is sent successfully
    } catch (err: any) {
      setError(err.message || `Failed to send OTP via ${method}.`);
    }
  };

  return (
    <SimpleLayout>
      <div className="w-screen max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col py-6 space-y-3 bg-background text-center border-b border-border">
          <h3>Login</h3>
          <p>Use your email and password to login</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 bg-gray-50 px-16 py-6">
          {error && <p className="text-red-600 text-center">{error}</p>}

          <div>
            <Label htmlFor="email" className="text-xs uppercase">
              Email Address
              <Input
                {...register('email')}
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
            <PasswordLogin {...{ register, errors }} />
          ) : (
            <OtpLogin {...{ register, errors, handleSendOtpClick, resendOtpTimer, setError }} />
          )}

          <Button className="text-sm w-full" type="submit">
            Login
          </Button>

          <ToggleLoginMethod {...{ loginMethod, setLoginMethod }} />

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

function PasswordLogin({ register, errors }: any) {
  return (
    <div>
      <Label htmlFor="password" className="text-xs uppercase">
        Password
        <Input
          {...register('password')}
          type="password"
          className="text-sm"
        />
      </Label>
      {errors.password && (
        <p className="text-sm font-medium text-destructive">
          {errors.password.message}
        </p>
      )}
    </div>
  );
}

function OtpLogin({ register, errors, handleSendOtpClick, resendOtpTimer, setError }: any) {
  return (
    <div>
      <Label htmlFor="otp" className="text-xs uppercase">
        OTP
        <Input {...register('otp')} type="text" required className="text-sm flex-1" />
      </Label>
      {errors.otp && (
        <p className="text-sm font-medium text-destructive">
          {errors.otp.message}
        </p>
      )}

      {resendOtpTimer > 0 && (
        <p className="text-xs text-gray-600 mt-2">
          Resend OTP in {resendOtpTimer} seconds
        </p>
      )}

      <div className="flex flex-col gap-2 w-full mt-4">
        <OtpButton {...{ handleSendOtpClick, resendOtpTimer, setError, method: 'whatsapp', label: 'Send OTP via WhatsApp' }} />
        <OtpButton {...{ handleSendOtpClick, resendOtpTimer, setError, method: 'email', label: 'Send OTP via Email' }} />
      </div>
    </div>
  );
}

function OtpButton({ handleSendOtpClick, resendOtpTimer, setError, method, label }: any) {
  const borderColor = method === 'whatsapp' ? 'border-green-600' : 'border-blue-600';
  const textColor = method === 'whatsapp' ? 'text-green-600' : 'text-blue-600';
  const hoverBgColor = method === 'whatsapp' ? 'hover:bg-green-600' : 'hover:bg-blue-600';
  const hoverTextColor = 'hover:text-white';
  const focusRingColor = method === 'whatsapp' ? 'focus:ring-green-600' : 'focus:ring-blue-600';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        const email = (e.target as HTMLButtonElement).form?.email?.value;
        if (email) {
          handleSendOtpClick(email, method);
        } else {
          setError('Email is required to send OTP.');
        }
      }}
      className={`text-sm border ${borderColor} ${textColor} rounded py-2 px-4 ${hoverBgColor} ${hoverTextColor} focus:outline-none focus:ring-2 ${focusRingColor} focus:ring-opacity-50 ${resendOtpTimer > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={resendOtpTimer > 0}
    >
      {label}
    </button>
  );
}

function ToggleLoginMethod({ loginMethod, setLoginMethod }: any) {
  return (
    <button
      type="button"
      onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')}
      className="text-sm w-full border border-blue-600 text-blue-600 rounded py-2 px-4 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
    >
      {loginMethod === 'password' ? 'Login with OTP' : 'Login with Password'}
    </button>
  );
}

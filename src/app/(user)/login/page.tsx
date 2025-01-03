"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LucideLoader2 } from "lucide-react";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useCountdown } from "@/lib/hooks/use-countdown";
import {
  signInFromLogin,
  sendOtpViaWhatsApp,
  sendOtpViaEmail,
} from "@/lib/actions";
import {
  LoginSchemaPhone,
  LoginSchemaEmail,
  LoginSchemaPassword,
  LoginTypesEmail,
  LoginTypesPassword,
  LoginTypesPhone,
} from "@/lib/forms";
import {
  CredentialsSigninError,
  FailedToSendEmailOTP,
  FailedToSendWhatsappOTP,
  UnknownError,
} from "@/lib/errors";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { GradientLayout } from "@/components/page-layouts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function FormFooter({
  form,
  disabled,
}: {
  form: UseFormReturn<any>;
  disabled?: boolean;
}) {
  return (
    <>
      {form.formState.errors.root && (
        <p className="text-sm font-medium text-destructive whitespace-pre-line">
          {form.formState.errors.root?.message}
        </p>
      )}

      <div className="pt-3">
        <Button
          type="submit"
          className="w-full flex gap-2"
          disabled={disabled || form.formState.isSubmitting}
        >
          Login
          <LucideLoader2
            className={cn(
              "animate-spin w-4 h-4",
              form.formState.isSubmitting ? "" : "hidden",
            )}
          />
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {" Don't have an account? "}
        <Link href="/register" className="font-bold hover:underline">
          {"Sign up"}
        </Link>
        {" for free."}
      </p>
    </>
  );
}

function PhoneLogin() {
  const router = useRouter();
  const form = useForm<LoginTypesPhone>({
    resolver: zodResolver(LoginSchemaPhone),
  });
  const { countdown: resendOtpTimer, setCountdown: setResendOtpTimer } =
    useCountdown(0);
  const [sendingOTP, setSendingOTP] = useState(false);

  const handleSendOtpClick = async (phone?: string) => {
    try {
      form.clearErrors();
      setSendingOTP(true);

      if (!phone) {
        form.setError("phone", { message: "Phone number is required." });
        return;
      }

      const ret = await sendOtpViaWhatsApp(phone);
      if (!ret) {
        setResendOtpTimer(60);
      } else if (typeof ret === typeof FailedToSendWhatsappOTP) {
        form.setError("otp", {
          message: "Failed to send passcode via Whatsapp.",
        });
      }
    } finally {
      setSendingOTP(false);
    }
  };

  const onSubmit = async (data: LoginTypesPhone) => {
    form.clearErrors();
    const ret = await signInFromLogin(data);
    if (typeof ret === typeof CredentialsSigninError) {
      form.setError("root", {
        message: "Failed to login.\nPlease check your passcode and try again.",
      });
    } else if (typeof ret === typeof UnknownError) {
      form.setError("root", { message: "Failed to login. Unknown Error" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input
                  onChange={field.onChange}
                  name={field.name}
                  type="tel"
                  placeholder="+254 0755 555 555"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Passcode</FormLabel>
              <div className="flex items-center gap-3">
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    pattern="^[0-9]+$"
                    onChange={field.onChange}
                    name={field.name}
                  >
                    <InputOTPGroup className="bg-background">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  className="w-auto bg-green-400/35 text-green-600 dark:text-green-400 border-green-600"
                  onClick={() => handleSendOtpClick(form.getValues("phone"))}
                  disabled={sendingOTP || resendOtpTimer > 0}
                >
                  Send Code
                </Button>
              </div>
              {resendOtpTimer > 0 && (
                <p className="text-xs text-muted mt-2">
                  Resend OTP in {resendOtpTimer} seconds
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormFooter form={form} />
      </form>
    </Form>
  );
}

function EmailLogin() {
  const router = useRouter();
  const form = useForm<LoginTypesEmail>({
    resolver: zodResolver(LoginSchemaEmail),
  });
  const { countdown: resendOtpTimer, setCountdown: setResendOtpTimer } =
    useCountdown(0);
  const [sendingOTP, setSendingOTP] = useState(false);

  const handleSendOtpClick = async (email?: string) => {
    try {
      form.clearErrors();
      setSendingOTP(true);

      if (!email) {
        form.setError("email", { message: "Email is required." });
        return;
      }

      const ret = await sendOtpViaEmail(email);
      if (!ret) {
        setResendOtpTimer(60);
      } else if (typeof ret === typeof FailedToSendEmailOTP) {
        form.setError("otp", {
          message: "Failed to send passcode via email.",
        });
      }
    } finally {
      setSendingOTP(false);
    }
  };

  const onSubmit = async (data: LoginTypesEmail) => {
    form.clearErrors();
    const ret = await signInFromLogin(data);
    if (typeof ret === typeof CredentialsSigninError) {
      form.setError("root", {
        message: "Failed to login.\nPlease check your passcode and try again.",
      });
    } else if (typeof ret === typeof UnknownError) {
      form.setError("root", { message: "Failed to login. Unknown Error" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  onChange={field.onChange}
                  name={field.name}
                  type="email"
                  placeholder="patrick@haru.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Passcode</FormLabel>
              <div className="flex items-center gap-3">
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    pattern="^[0-9]+$"
                    onChange={field.onChange}
                    name={field.name}
                  >
                    <InputOTPGroup className="bg-background">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  className="w-auto bg-blue-500/35 text-blue-600 dark:text-blue-400 border-blue-600"
                  onClick={() => handleSendOtpClick(form.getValues("email"))}
                  disabled={sendingOTP || resendOtpTimer > 0}
                >
                  Send Code
                </Button>
              </div>
              {resendOtpTimer > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  Resend OTP in {resendOtpTimer} seconds
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormFooter form={form} />
      </form>
    </Form>
  );
}

function PasswordLogin() {
  const router = useRouter();
  const form = useForm<LoginTypesPassword>({
    resolver: zodResolver(LoginSchemaPassword),
  });

  const onSubmit = async (data: LoginTypesPassword) => {
    form.clearErrors();
    const ret = await signInFromLogin(data);
    if (typeof ret === typeof CredentialsSigninError) {
      form.setError("root", {
        message:
          "Failed to login.\nPlease check your credentials and try again.",
      });
    } else if (typeof ret === typeof UnknownError) {
      form.setError("root", { message: "Failed to login. Unknown Error" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  onChange={field.onChange}
                  name={field.name}
                  type="email"
                  placeholder="patrick@haru.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  onChange={field.onChange}
                  name={field.name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormFooter form={form} />
      </form>
    </Form>
  );
}

function LoginCard() {
  const [tabValue, setTabValue] = useState("password");
  return (
    <Card className="w-full max-w-lg p-0 rounded-4xl overflow-hidden">
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <CardHeader className="space-y-3 text-center pt-8">
          <CardTitle className="text-3xl">Login</CardTitle>
          <CardDescription className="text-base">
            Choose your preferred login method.
          </CardDescription>
          <TabsList className="grid grid-cols-3 gap-2">
            <TabsTrigger
              disabled
              value="phone"
              className="data-[state=active]:text-green-400 data-[state=active]:bg-green-400/35"
            >
              Whatsapp
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="data-[state=active]:text-blue-400 data-[state=active]:bg-blue-400/35"
            >
              Email
            </TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="bg-muted p-12 pt-2 border-t">
          <TabsContent value="phone" className="space-y-4">
            <PhoneLogin />
          </TabsContent>
          <TabsContent value="email" className="space-y-4">
            <EmailLogin />
          </TabsContent>
          <TabsContent value="password" className="space-y-4">
            <PasswordLogin />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

export default function Login() {
  return (
    <GradientLayout>
      <div className="w-screen max-w-md rounded-2xl overflow-hidden">
        <LoginCard />
      </div>
    </GradientLayout>
  );
}

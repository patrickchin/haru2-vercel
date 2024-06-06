"use client";

import { useState, useEffect } from "react";
import { signInFromLogin } from "@/lib/actions";
import { sendOtpViaWhatsApp, sendOtpViaEmail } from "@/lib/otp";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { SimpleLayout } from "@/components/page-layouts";
import { loginZodSchemas } from "@/lib/forms";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function PhoneLogin() {
  const form = useForm({
    resolver: zodResolver(loginZodSchemas.phone),
  });
  const onSubmit = (data: any) => {
    console.log(data);
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
                  <InputOTP maxLength={6} pattern="^[0-9]+$" {...field}>
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
                  className="w-auto bg-green-50 text-green-600 border-green-600"
                >
                  Send Code
                </Button>
              </div>
              <FormDescription className="hidden bg-background px-4 py-2 rounded-md text-sm border">
                Please enter the one-time password sent to your phone. One time
                passcode expires in {}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-3">
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
}

function EmailLogin() {
  const form = useForm({
    resolver: zodResolver(loginZodSchemas.email),
  });
  const onSubmit = (data: any) => {
    console.log(data);
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
                  <InputOTP maxLength={6} pattern="^[0-9]+$" {...field}>
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
                  className="w-auto bg-blue-50 text-blue-600 border-blue-600"
                >
                  Send Code
                </Button>
              </div>
              <FormDescription className="hidden bg-background px-4 py-2 rounded-md text-sm border">
                Please enter the one-time password sent to your email. One time
                passcode expires in {}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-3">
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
}

function PasswordLogin() {
  const form = useForm({
    resolver: zodResolver(loginZodSchemas.password),
  });
  const onSubmit = (data: any) => {
    console.log(data);
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
              <FormLabel className="text-xs">Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-3">
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
}

function LoginCard() {
  const [tabValue, setTabValue] = useState("phone");
  return (
    <Card className="w-full max-w-lg p-0 rounded-4xl shadow-xl overflow-hidden">
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <CardHeader className="space-y-3 text-center pt-8">
          <CardTitle className="text-3xl">Login</CardTitle>
          <CardDescription className="text-base">
            Choose your preferred login method.
          </CardDescription>
          <TabsList className="grid grid-cols-3 gap-2">
            <TabsTrigger
              value="phone"
              className="data-[state=active]:text-green-400 data-[state=active]:bg-green-50 "
            >
              Whatsapp
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="data-[state=active]:text-blue-400 data-[state=active]:bg-blue-100 "
            >
              Email
            </TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="bg-gray-50 p-12 pt-2 border-t">
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
    <SimpleLayout>
      <div className="w-screen max-w-md rounded-2xl shadow-xl overflow-hidden">
        <LoginCard />
      </div>
    </SimpleLayout>
  );
}
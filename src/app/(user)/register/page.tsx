"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/actions";
import { SimpleLayout } from "@/components/page-layouts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterSchemaType } from "@/lib/forms";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LucideLoader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Page() {
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit: SubmitHandler<RegisterSchemaType> = async (data) => {
    const ret = await registerUser(data);
    if (ret?.error) {
      form.setError("root", { message: "Failed to register user" });
    }
  };

  return (
    <SimpleLayout>
      <div className="w-screen max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col py-6 space-y-3 bg-background text-center border-b border-border">
          <h3>Create an Account</h3>
          <p>Create an account with your email and password</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4 bg-gray-50 px-16 py-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">
                    Name
                    <span className="font-bold text-red-400 ml-1">*</span>
                  </FormLabel>
                  <FormControl className="w-full">
                    <Input placeholder="Anthony Abu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Phone Number</FormLabel>
                  <FormControl className="w-full">
                    <PhoneInput placeholder="+234-803-4444 4444" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">
                    Email Address
                    <span className="font-bold text-red-400 ml-1">*</span>
                  </FormLabel>
                  <FormControl className="w-full">
                    <Input type="email" placeholder="harpapro@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">
                    Password
                    <span className="font-bold text-red-400 ml-1">*</span>
                  </FormLabel>
                  <FormControl className="w-full">
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">
                    Confirm Password
                    <span className="font-bold text-red-400 ml-1">*</span>
                  </FormLabel>
                  <FormControl className="w-full">
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormMessage>{form.formState.errors.root?.message}</FormMessage>

            <Button
              type="submit"
              className="w-full flex gap-2"
              disabled={form.formState.isSubmitting}
            >
              Sign Up
              <LucideLoader2
                className={cn(
                  "animate-spin w-4 h-4",
                  form.formState.isSubmitting ? "" : "hidden",
                )}
              />
            </Button>

            <p className="text-center text-sm text-gray-600">
              {"Already have an account? "}
              <Link href="/login" className="font-bold hover:underline">
                {"Login"}
              </Link>
              {" instead."}
            </p>
          </form>
        </Form>
      </div>
    </SimpleLayout>
  );
}
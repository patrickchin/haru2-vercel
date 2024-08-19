"use client";

import { cn } from "@/lib/utils";
import { useForm, UseFormReturn } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LucideLoader2 } from "lucide-react";
import { CenteredLayout } from "@/components/page-layouts";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

function PersonnelDetailsFields({
  form,
  name,
}: {
  form: UseFormReturn<any>;
  name: string;
}) {
  return (
    <>
      <FormField
        control={form.control}
        name={`${name}-name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input name={field.name} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`${name}-email`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input name={field.name} onChange={field.onChange} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`${name}-phone`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input name={field.name} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

export function NewSiteForm() {
  const form = useForm({
    // resolver: zodResolver(LoginSchemaPassword),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((d) => {})}
        className="grid grid-cols-2 gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name/Owner</FormLabel>
              <FormControl>
                <Input
                  onChange={field.onChange}
                  name={field.name}
                  placeholder="new project"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name/Owner</FormLabel>
              <FormControl>
                <Input
                  onChange={field.onChange}
                  name={field.name}
                  placeholder="hotel, school, family home ..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Address</FormLabel>
              <FormControl>
                <Input
                  onChange={field.onChange}
                  name={field.name}
                  placeholder="site address "
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Postcode</FormLabel>
              <FormControl>
                <Input
                  onChange={field.onChange}
                  name={field.name}
                  placeholder="site postcode"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea
                  name={field.name}
                  onChange={field.onChange}
                  className="h-36"
                  placeholder="Tell us a little bit about your project"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="completion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Timeline</FormLabel>
              <FormControl>
                <Textarea
                  name={field.name}
                  onChange={field.onChange}
                  className="h-36"
                  placeholder="Tell us an approximate timeline of your project"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="col-span-2" />

        <div className="col-span-2 space-y-4">
          <h5>Building Construction Project Manager</h5>
          <div className="grid grid-cols-4 gap-4">
            <PersonnelDetailsFields form={form} name="manager" />
          </div>
        </div>

        <div className="col-span-2 space-y-4">
          <h5>Building Contractor</h5>
          <div className="grid grid-cols-4 gap-4">
            <PersonnelDetailsFields form={form} name="contractor-1" />
          </div>
        </div>

        <div className="col-span-2 flex justify-end">
          <Button
            type="submit"
            className="flex gap-2"
            disabled={form.formState.isSubmitting}
          >
            <Link href={`/sites`}>
              Next
              <LucideLoader2
                className={cn(
                  "animate-spin w-4 h-4",
                  form.formState.isSubmitting ? "" : "hidden",
                )}
              />
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function Page() {
  return (
    <CenteredLayout>
      <NewSiteForm />
    </CenteredLayout>
  );
}

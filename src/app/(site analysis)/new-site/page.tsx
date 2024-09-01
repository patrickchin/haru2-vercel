"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addSiteSchema, AddSiteType } from "@/lib/forms";
import * as Actions from "@/lib/actions";

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
import { CenteredLayout } from "@/components/page-layouts";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { LucideLoader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CountrySelectForm({ form }: { form: any }) {
  const displayNames = useMemo(() => {
    return new Intl.DisplayNames(["en"], { type: "region" });
  }, []);

  return (
    <FormField
      control={form.control}
      name="countryCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Country</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select the country of your site" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {["NG", "SL", "GH", "KE"].map((c) => {
                return (
                  <SelectItem value={c}>
                    {displayNames.of(c)} ({c})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function NewSiteForm() {
  const form = useForm<AddSiteType>({
    resolver: zodResolver(addSiteSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((d) => {
          console.log(d);
          Actions.addSite(d);
        })}
        // onSubmit={(e) => {
        //   e.preventDefault();
        //   console.log(e);
        // }}
        className="grid grid-cols-2 gap-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title/Owner</FormLabel>
              <FormControl>
                <Input
                  onChange={field.onChange}
                  name={field.name}
                  placeholder="Blue Bird Housing Project 1"
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
              <FormLabel>Type of Construciton Project</FormLabel>
              <FormControl>
                <Input
                  onChange={field.onChange}
                  name={field.name}
                  placeholder="Hotel, School, Family Home ..."
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
                  placeholder="1, My Street, Ilassan Lekki, Lagos"
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
                  placeholder="123 123"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CountrySelectForm form={form} />

        <div className="col-span-2 space-y-4">
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
        </div>

        <Separator className="col-span-2" />

        <div className="col-span-2 flex justify-end">
          <Button
            type="submit"
            className="flex gap-2"
            // disabled={form.formState.isSubmitting}
          >
            Next
            <LucideLoader2
              className={cn(
                "animate-spin w-4 h-4",
                form.formState.isSubmitting ? "" : "hidden",
              )}
            />
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

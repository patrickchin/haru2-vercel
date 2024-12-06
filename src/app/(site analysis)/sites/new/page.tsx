"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSiteNewBoth, zSiteNewBothType } from "@/lib/forms";
import * as Actions from "@/lib/actions";

import { LucideLoader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DefaultLayout } from "@/components/page-layouts";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoBox } from "@/components/info-box";

function CountrySelectForm({ form }: { form: any }) {
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
                  <SelectItem value={c} key={c}>
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
  const form = useForm<zSiteNewBothType>({
    resolver: zodResolver(zSiteNewBoth),
  });

  const descriptionPlaceholder =
    "e.g.\n" +
    "I'm building a hospital, it is a large-scale development ...\n" +
    "The construction is expected to be completed within the next two years ...\n";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (d: zSiteNewBothType) => {
          await Actions.addSite(d);
        })}
        className="flex flex-col p-4 sm:grid sm:grid-cols-2 gap-6 w-full"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title/Owner</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={undefined}
                  placeholder="Mr Patrick, Blue Bird Housing Project"
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
              <FormLabel>Type of Construciton Project (Optional)</FormLabel>
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
              <FormLabel>Site Address (Optional)</FormLabel>
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

        {/* <FormField
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
        /> */}

        <CountrySelectForm form={form} />

        <div className="sm:col-span-2 space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <div className="text-sm text-muted-foreground p-1">
                  Tell us a little bit about your project, possible information
                  to include:
                  <ul className="list-inside list-disc">
                    <li>Current or expected timeline of your project </li>
                    <li>
                      Current and expected project size (eg; small scale, medium
                      scale, or large scale)
                    </li>
                  </ul>
                </div>
                <FormControl>
                  <Textarea
                    name={field.name}
                    onChange={field.onChange}
                    className="min-h-28"
                    placeholder={descriptionPlaceholder}
                    autoResize={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <InfoBox className="col-span-2 leading-6">
          After submitting your project, you will be redirected to your project
          page. <br />
          From there you will be able to schedule a meeting with us and we will
          organize a site supervisor to attend your construction site.
        </InfoBox>
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
    <DefaultLayout className="items-center max-w-3xl">
      <NewSiteForm />
      
    </DefaultLayout>
  );
}

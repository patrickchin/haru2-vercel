"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSiteNewBoth, zSiteNewBothType } from "@/lib/forms";
import * as Actions from "@/lib/actions";

import { LucideArrowRight, LucideLoader2 } from "lucide-react";
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
import { DefaultLayout } from "@/components/page-layouts";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoBox } from "@/components/info-box";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { supportedCountries } from "@/lib/constants";

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
              {supportedCountries.map((c) => {
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
  const router = useRouter();
  const form = useForm<zSiteNewBothType>({
    resolver: zodResolver(zSiteNewBoth),
  });

  const shortDescriptionPlaceholder = true;
  const descriptionPlaceholder = shortDescriptionPlaceholder
    ? "Your project description ..."
    : "e.g.\n" +
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
              <FormLabel>Type of Construction Project (Optional)</FormLabel>
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

        <InfoBox className="col-span-2 leading-6 hidden">
          After submitting your project, you will be redirected to your project
          page.
        </InfoBox>
        <div className="col-span-2 flex justify-end">
          <Button
            type="submit"
            className="flex gap-2"
            disabled={form.formState.isSubmitting}
          >
            Submit
            {form.formState.isSubmitting ? (
              <LucideLoader2 className="animate-spin" />
            ) : (
              <LucideArrowRight />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function Page() {
  return (
    <DefaultLayout className="max-w-4xl">
      <Card>
        <CardContent className="p-6">
          <NewSiteForm />
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}

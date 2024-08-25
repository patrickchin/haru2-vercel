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
import { LucideLoader2, LucideMoveLeft } from "lucide-react";
import { CenteredLayout } from "@/components/page-layouts";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import BackButton from "@/components/back-button";

function AddQuestionsForm() {
  const form = useForm({
    // resolver: zodResolver(LoginSchemaPassword),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((d) => {})}
        className="flex flex-col gap-4"
      >

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add a New Question</FormLabel>
              <FormControl>
                <Input
                  onChange={field.onChange}
                  name={field.name}
                  placeholder="new question"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2 flex justify-end">
          <Button
            type="submit"
            className="flex gap-2"
            disabled={form.formState.isSubmitting}
          >
            <Link href={`/sites`}>
              Save
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

function ExistingQuestions() {
  return (
    <div>
      <h3>
        <BackButton variant="secondary" className="shadow-md">
          <LucideMoveLeft />
        </BackButton>
        Questions for the upcoming report:
      </h3>
      <ul>
        <li>Question 1</li>
        <li>Question 2</li>
        <li>Question 1</li>
        <li>Question 1</li>
        <li>Question 1</li>
        <li>Question 1</li>
        <li>Question 1</li>
        <li>Question 1</li>
      </ul>
    </div>
  );
}

export default function Page() {
  return (
    <CenteredLayout>
      <ExistingQuestions />
      <AddQuestionsForm />
    </CenteredLayout>
  );
}
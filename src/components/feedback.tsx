"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Actions from "@/lib/actions";

import { LucideLoader2, LucideMessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { useRef } from "react";

function AddFeedbackForm() {
  const schema = z.object({
    email: z.string().optional(),
    message: z.string().min(1, "Please enter a message!"),
  });
  type SchemaType = z.infer<typeof schema>;

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });

  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data: SchemaType) => {
          await Actions.addFeedback(data);
          closeRef.current?.click();
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field: { value, ...field2 } }) => (
            <FormItem>
              <FormLabel>Email (optional)</FormLabel>
              <FormDescription>
                Fill out your email for us to get back to you about your
                feedback.
              </FormDescription>
              <Input {...field2} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field: { value, ...field2 } }) => (
            <FormItem>
              <FormLabel>Your Message</FormLabel>
              <FormDescription>
                Tells us about any issues with the site or if you have specific
                feature requests.
              </FormDescription>
              <Textarea {...field2} className="h-52" />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <DialogClose className="hidden" ref={closeRef} />
          <Button
            type="submit"
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
            className="flex items-center"
          >
            Submit
            {form.formState.isSubmitting && (
              <LucideLoader2 className="animate-spin w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function AddFeedback() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed bottom-4 right-4">
          Feedback
          <LucideMessageSquare />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Send us your Feedback!</DialogTitle>
        <AddFeedbackForm />
      </DialogContent>
    </Dialog>
  );
}

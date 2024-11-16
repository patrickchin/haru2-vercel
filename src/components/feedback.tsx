"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Actions from "@/lib/actions";

import { LucideMessageSquare } from "lucide-react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";

function AddFeedbackForm() {
  const schema = z.object({
    email: z.string().optional(),
    message: z.string(),
  });
  type SchemaType = z.infer<typeof schema>;

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data: SchemaType) => {
          await Actions.addFeedback(data);
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grow max-w-2xl">
              <FormLabel>Email</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="grow max-w-2xl">
              <FormLabel>Feedback Message</FormLabel>
              <Textarea {...field} value={undefined} />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <DialogClose asChild>
            <Button type="submit">Submit</Button>
          </DialogClose>
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

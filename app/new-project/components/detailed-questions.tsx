"use client"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

export default function DetailedQuestions({ form }:{ form : any }) {
  return (
    <FormField
      control={form.control}
      name="bio"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bio</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Tell us a little bit about yourself"
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormDescription>
            You can <span>@mention</span> other users and organizations.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
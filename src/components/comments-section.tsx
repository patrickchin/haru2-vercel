"use client";

import useSWR from "swr";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HaruComment } from "@/lib/types";
import * as Actions from "@/lib/actions";

import {
  LucideArrowUp,
  LucideLoader2,
  LucideSendHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HaruUserAvatar, UserAvatar } from "@/components/user-avatar";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";

function CommentsSectionAdd({
  commentsSectionId,
  mutated,
}: {
  commentsSectionId: number;
  mutated: () => void;
}) {
  const schema = z.object({
    comment: z.string().min(1),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { comment: "" },
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    await Actions.addCommentToSection(commentsSectionId, data);
    form.resetField("comment", { defaultValue: "" });
    mutated();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row gap-4"
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="grow">
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Add your comment here"
                  className="h-36"
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end items-end">
          <Button
            type="submit"
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
            className="flex items-center"
          >
            Send
            {form.formState.isSubmitting ? (
              <LucideLoader2 className="animate-spin w-3.5 h-3.5" />
            ) : (
              <LucideSendHorizontal className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function CommentsSection({
  commentsSectionId,
}: {
  commentsSectionId: number;
}) {
  const {
    data: comments,
    mutate: mutateComments,
    isLoading,
    isValidating,
  } = useSWR<HaruComment[] | undefined>(
    `/api/comments/${commentsSectionId}`, // api route doesn't really exist
    async () => {
      return Actions.listCommentsFromSection(commentsSectionId);
    },
  );

  return (
    <Card id="meetings">
      <CardHeader className="font-semibold">Comments Section</CardHeader>
      <CardContent className="space-y-8">
        <CommentsSectionAdd
          commentsSectionId={commentsSectionId}
          mutated={() => mutateComments()}
        />

        <ol>
          <li className="flex flex-row justify-center mb-4">
            <Button
              variant="secondary"
              disabled={isLoading || isValidating}
              onClick={() => mutateComments()}
            >
              Load new comments
              {isValidating ? (
                <LucideLoader2 className="animate-spin" />
              ) : (
                <LucideArrowUp />
              )}
            </Button>
          </li>
          {comments?.map((c) => (
            <li
              className="flex items-start gap-4 p-4 hover:bg-accent rounded border-t"
              key={c.id}
            >
              <HaruUserAvatar user={c.user ?? undefined} />
              <div className="grid gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="font-medium">{c.user?.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(c.createdAt, { addSuffix: true })}
                  </div>
                </div>
                <div className="whitespace-pre-line">{c.comment}</div>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

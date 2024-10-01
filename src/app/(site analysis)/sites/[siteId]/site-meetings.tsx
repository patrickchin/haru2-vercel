"use client";

import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useSWR from "swr";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { SiteMeeting, SiteMeetingNew } from "@/lib/types";
import * as Schemas from "@/drizzle/schema";
import * as Actions from "@/lib/actions";

import {
  LucideCalendar,
  LucideCheck,
  LucideExternalLink,
  LucidePlus,
  LucideTrash,
  LucideX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { SiteDetailsProps } from "./page";

const formSchema = createInsertSchema(Schemas.siteMeetings1).omit({
  id: true,
  siteId: true,
});

function SiteCalendarForm({
  siteId,
  mutated,
}: {
  siteId: number;
  mutated: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await Actions.addSiteMeeting(siteId, data);
    mutated();
  }

  const dateNow = new Date();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row gap-4 w-full"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="grow max-w-72">
              <FormLabel>Meeting Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 font-normal w-full",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <LucideCalendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={field.value ?? undefined}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(dateNow.getTime() - 24 * 60 * 60_000) ||
                      date > new Date(dateNow.getTime() + 62 * 24 * 60 * 60_000)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="grow">
              <FormLabel className="">Meeting Time</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? undefined}
                  placeholder="Specify your prefered times"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-end">
          <Button type="submit" className="gap-2">
            Add a Meeting Time
            <LucidePlus className="w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function SiteMeetings({ site, members }: SiteDetailsProps) {
  const { data: session } = useSession();

  const {
    data: meetings,
    mutate: mutateMeetings,
    isLoading,
    isValidating,
  } = useSWR<SiteMeeting[] | undefined>(
    `/api/sites/${site.id}/meetings`, // api route doesn't really exist
    async () => {
      return Actions.getSiteMeetings(site.id);
    },
  );

  const role = members?.find((m) => m.id === session?.user?.idn)?.role;

  const [isUpdating, setIsUpdating] = useState(false);
  const updateMeeting = useCallback(
    async (
      meetingId: number,
      updateValues: SiteMeetingNew,
      del: boolean = false,
    ) => {
      try {
        setIsUpdating(true);
        await mutateMeetings(() => {
          return del
            ? Actions.deleteSiteMeetingReturnAllMeetings(meetingId)
            : Actions.updateSiteMeetingReturnAllMeetings(
                meetingId,
                updateValues,
              );
        });
      } finally {
        setIsUpdating(false);
      }
    },
    [mutateMeetings],
  );

  return (
    <>
      <p>
        Suggest a few meeting times and dates. We will confirm the time both
        here and via email. <br />
        The zoom link will be emailed out and shown below prior to the meeting.
      </p>
      <SiteCalendarForm siteId={site.id} mutated={() => mutateMeetings()} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time/Notes</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Zoom Link</TableHead>
            <TableHead className="w-0"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="p-8">
                Loading ...
              </TableCell>
            </TableRow>
          ) : meetings && meetings.length > 0 ? (
            meetings.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.date?.toDateString() ?? "Unspecified"}</TableCell>
                <TableCell>{m.notes ?? "Unspecified"}</TableCell>
                <TableCell className="capitalize">{m.status}</TableCell>
                <TableCell>
                  {m.url ? (
                    <Link
                      href={m.url ?? "#"}
                      target="_blank"
                      className="flex items-center gap-2"
                    >
                      Meeting Link{" "}
                      <LucideExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    "Not created"
                  )}
                </TableCell>
                <TableCell className="flex gap-1">
                  {role === "owner" && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-8 h-8 p-1"
                      disabled={isValidating || isUpdating}
                      onClick={() => updateMeeting(m.id, {}, true)}
                    >
                      <LucideTrash className="w-3.5" />
                    </Button>
                  )}
                  {role === "supervisor" && (
                    <>
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-8 h-8 p-1"
                        disabled={isValidating || isUpdating}
                        onClick={() =>
                          updateMeeting(m.id, {
                            status:
                              m.status === "confirmed"
                                ? "cancelled"
                                : "rejected",
                          })
                        }
                      >
                        <LucideX className="w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-8 h-8 p-1"
                        disabled={isValidating || isUpdating}
                        onClick={() =>
                          updateMeeting(m.id, { status: "confirmed" })
                        }
                      >
                        <LucideCheck className="w-3.5" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="p-8">
                No scheduled meetings
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

"use client";

import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useSWR from "swr";
import { formatDate } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  SiteDetails,
  SiteMeeting,
  SiteMeetingNew,
  SiteMember,
} from "@/lib/types";
import * as Actions from "@/lib/actions";

import {
  LucideCalendar,
  LucideCheck,
  LucideExternalLink,
  LucideMessageCircleWarning,
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
import { InfoBox } from "@/components/info-box";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { acceptMeetingRoles, editMeetingRoles } from "@/lib/permissions";

const formSchema = z.object({
  date: z.date(),
  notes: z.string(),
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
        className="flex flex-col sm:flex-row gap-4 w-full"
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
                        formatDate(field.value, "PPP")
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

        <div className="flex sm:items-end sm:h-16 sm:mt-2">
          <Button type="submit" className="gap-2">
            Add Meeting Time
            <LucidePlus className="w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function SiteMeetings({
  site,
  members,
}: {
  site: SiteDetails;
  members: SiteMember[] | undefined;
}) {
  const { data: session } = useSession();

  const {
    data: meetings,
    mutate: mutateMeetings,
    isLoading,
    isValidating,
  } = useSWR<SiteMeeting[] | undefined>(
    `/api/sites/${site.id}/meetings`, // api route doesn't really exist
    async () => {
      return Actions.listSiteMeetings(site.id);
    },
  );

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

  const role = members?.find((m) => m.id === session?.user?.idn)?.role;
  const canEditMeetings = role && editMeetingRoles.includes(role);
  const canAcceptMeetings = role && acceptMeetingRoles.includes(role);

  return (
    <Card id="meetings">
      <CardHeader className="font-semibold">
        Schedule a Zoom Meeting with the Team
      </CardHeader>
      <CardContent className="space-y-8">
        {canEditMeetings ? (
          <InfoBox>
            Suggest a few meeting times and dates and we will confirm the time
            both here and via email. The zoom link will be emailed out and shown
            below prior to the meeting.
          </InfoBox>
        ) : (
          <InfoBox>
            The project owner will create schedule meetings with the site
            supervisor. Meeting dates and times will appear here.
          </InfoBox>
        )}
        {canEditMeetings && (
          <SiteCalendarForm siteId={site.id} mutated={() => mutateMeetings()} />
        )}
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
                <TableCell colSpan={5} className="p-8">
                  Loading ...
                </TableCell>
              </TableRow>
            ) : meetings && meetings.length > 0 ? (
              meetings.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    {m.date?.toDateString() ?? "Unspecified"}
                  </TableCell>
                  <TableCell>{m.notes ?? "Unspecified"}</TableCell>
                  <TableCell
                    className={cn(
                      "capitalize",
                      m.status === "pending" && "bg-none",
                      m.status === "rejected" && "bg-red-100",
                      m.status === "cancelled" && "bg-red-100",
                      m.status === "confirmed" && "bg-green-100",
                      // m.status === "completed" && "bg-blue-100",
                    )}
                  >
                    {m.status}
                  </TableCell>
                  <TableCell>
                    {m.url ? (
                      <Button variant="link" asChild className="p-0 h-auto">
                        <Link
                          href={m.url ?? "#"}
                          target="_blank"
                          className="flex items-center gap-2"
                        >
                          Meeting Link{" "}
                          <LucideExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    ) : (
                      "Not created"
                    )}
                  </TableCell>
                  <TableCell className="flex gap-1">
                    {canEditMeetings && (
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-8 h-8 p-1"
                        disabled={isValidating || isUpdating}
                        onClick={() => updateMeeting(m.id, {}, true)}
                      >
                        <LucideTrash
                          className="w-3.5 text-red-400"
                          strokeWidth={2.5}
                        />
                      </Button>
                    )}
                    {canAcceptMeetings && (
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
                <TableCell colSpan={5} className="p-8">
                  No scheduled meetings
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

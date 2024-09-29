"use client";

import useSWR from "swr";
import { format } from "date-fns";
import {
  LucideCalendar,
  LucideCheck,
  LucidePlus,
  LucideTrash,
  LucideX,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SiteMeeting } from "@/lib/types";
import * as Schemas from "@/drizzle/schema";
import * as Actions from "@/lib/actions";

import { toast } from "@/components/ui/use-toast";
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
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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
          <Button type="submit">
            <LucidePlus className="w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function SiteMeetings({ siteId }: { siteId: number }) {
  const {
    data: meetings,
    mutate: mutateMeetings,
    isLoading,
    isValidating,
  } = useSWR<SiteMeeting[] | undefined>(
    `/api/sites/${siteId}/meetings`, // api route doesn't really exist
    async () => {
      return Actions.getSiteMeetings(siteId);
    },
  );

  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <>
      <SiteCalendarForm siteId={siteId} mutated={() => mutateMeetings()} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time/Notes</TableHead>
            <TableHead>Status</TableHead>
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
                <TableCell>{m.date?.toDateString()}</TableCell>
                <TableCell>{m.notes}</TableCell>
                <TableCell className="capitalize">{m.status}</TableCell>
                <TableCell className="flex gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-8 h-8 p-1"
                    disabled={isValidating || isUpdating}
                    onClick={async () => {
                      try {
                        setIsUpdating(true);
                        await Actions.deleteSiteMeeting(m.id);
                        mutateMeetings();
                      } finally {
                        setIsUpdating(false);
                      }
                    }}
                  >
                    <LucideTrash className="w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-8 h-8 p-1"
                    disabled={isValidating || isUpdating}
                    onClick={async () => {
                      try {
                        setIsUpdating(true);
                        await Actions.updateSiteMeeting(m.id, {
                          status:
                            m.status === "confirmed" ? "cancelled" : "rejected",
                        });
                        mutateMeetings();
                      } finally {
                        setIsUpdating(false);
                      }
                    }}
                  >
                    <LucideX className="w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-8 h-8 p-1"
                    disabled={isValidating || isUpdating}
                    onClick={async () => {
                      try {
                        setIsUpdating(true);
                        await Actions.updateSiteMeeting(m.id, {
                          status: "confirmed",
                        });
                        mutateMeetings();
                      } finally {
                        setIsUpdating(false);
                      }
                    }}
                  >
                    <LucideCheck className="w-3.5" />
                  </Button>
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

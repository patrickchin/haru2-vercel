"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { cn } from "@/lib/utils";
import { createInsertSchema } from "drizzle-zod";
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

function SiteCalendarForm({ siteId }: { siteId: number }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    Actions.addSiteMeeting(siteId, data);
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
                      date > new Date(dateNow.getTime() + 32 * 24 * 60 * 60_000)
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
  return (
    <>
      <SiteCalendarForm siteId={siteId} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Suggested Time</TableHead>
            <TableHead>Agreed/Pending</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(2)
            .fill(0)
            .map((x, i) => (
              <TableRow key={i}>
                <TableCell>slkjfsd</TableCell>
                <TableCell>Pending ...</TableCell>
                <TableCell className="flex gap-1">
                  <Button size="icon" variant="outline" className="w-8 h-8 p-1">
                    <LucideTrash className="w-3.5" />
                  </Button>
                  <Button size="icon" variant="outline" className="w-8 h-8 p-1">
                    <LucideX className="w-3.5" />
                  </Button>
                  <Button size="icon" variant="outline" className="w-8 h-8 p-1">
                    <LucideCheck className="w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}

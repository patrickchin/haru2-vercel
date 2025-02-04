"use client";

import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { LucideCalendar } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

import { Calendar } from "./ui/calendar";
import { FormControl } from "./ui/form";
import { Button } from "./ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { useRef } from "react";

export function InputDate({
  field,
  disabled,
}: {
  field: ControllerRenderProps;
  disabled?: boolean;
}) {
  const closeRef = useRef<null | HTMLButtonElement>(null);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            disabled={disabled}
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
        <PopoverClose className="hidden" ref={closeRef}></PopoverClose>
        <Calendar
          mode="single"
          selected={field.value || undefined}
          onSelect={(...args) => {
            field.onChange(...args);
            closeRef.current?.click();
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

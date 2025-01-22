"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { countries } from "./phone-input/countries";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

export function SelectCountryFormField({
  form,
  field,
}: {
  form: UseFormReturn<any>;
  field: ControllerRenderProps<any>;
}) {
  return (
    <FormItem className="flex flex-col justify-begin">
      <FormLabel>Country</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "justify-between",
              !field.value && "text-muted-foreground",
            )}
          >
            {field.value
              ? countries.find((country) => country.iso2 === field.value)?.name
              : "Select country..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-auto"
          sideOffset={10}
          align="start"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <Command>
            <CommandInput placeholder="Search country..." className="h-9" />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((country) => (
                  <CommandItem
                    value={country.name}
                    key={country.id}
                    onSelect={() => {
                      form.setValue(field.name, country.iso2);
                    }}
                  >
                    {country.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        country.iso2 === field.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}

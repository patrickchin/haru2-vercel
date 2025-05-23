"use client";

import * as React from "react";
import { LucideChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

type DefaultOptionGroup = {
  label: string;
  options: string[];
};

type InputWithDefaultsProps = React.ComponentPropsWithoutRef<typeof Input> & {
  defaultOptions?: string[];
  defaultOptionGroups?: DefaultOptionGroup[];
};

export function InputWithDefaults({
  value,
  onChange,
  defaultOptions,
  defaultOptionGroups,
  className,
  ...props
}: InputWithDefaultsProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <DropdownMenu>
      <div className="flex items-center">
        <Input
          ref={inputRef}
          value={value}
          onChange={onChange}
          placeholder="Type or select a default..."
          className={cn("rounded-r-none border-r-0", className)}
          {...props}
        />
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-l-none">
            <LucideChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={4}
          className="max-h-[50svh] overflow-y-auto min-w-[16rem] z-50 p-0"
        >
          {defaultOptionGroups
            ? defaultOptionGroups.map((group) => (
                <DropdownMenuGroup key={group.label}>
                  <DropdownMenuLabel className="bg-muted border-t border-b">
                  {group.label}</DropdownMenuLabel>
                  {group.options.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onSelect={() =>
                        onChange?.({
                          target: { value: option },
                        } as React.ChangeEvent<HTMLInputElement>)
                      }
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              ))
            : defaultOptions?.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onSelect={() =>
                    onChange?.({
                      target: { value: option },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  {option}
                </DropdownMenuItem>
              ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() =>
              onChange?.({
                target: { value: "" },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            Clear
          </DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}

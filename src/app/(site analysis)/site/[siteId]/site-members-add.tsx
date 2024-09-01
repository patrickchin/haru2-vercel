"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateSiteMembersType, updateSiteMembersSchema } from "@/lib/forms";
import * as Actions from "@/lib/actions";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LucideLoader2 } from "lucide-react";
import { redirect, usePathname, useRouter, useSearchParams } from "next/navigation";

function SiteMemberFields({ form,  prefix }: { form: any, prefix: string }) {
  return (
    <div className="flex flex-col">
      <h5 className="capitalize">{prefix}</h5>

    <div className="grid grid-cols-3 gap-3">
      <FormField
        control={form.control}
        name={`${prefix}Name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="capitalize">Name</FormLabel>
            <FormControl>
              <Input onChange={field.onChange} name={field.name} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`${prefix}Phone`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="capitalize">Phone Number</FormLabel>
            <FormControl>
              <Input onChange={field.onChange} name={field.name} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`${prefix}Email`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="capitalize">Email</FormLabel>
            <FormControl>
              <Input onChange={field.onChange} name={field.name} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    </div>
  );
}

function EditSiteMembersForm() {
  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const form = useForm<UpdateSiteMembersType>({
    resolver: zodResolver(updateSiteMembersSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (d) => {
          console.log(d);
          await new Promise(r => setTimeout(r, 200));
          router.replace(pathname + "?" + createQueryString("m", "0"));
        })}
        className="flex flex-col gap-2"
      >
        <SiteMemberFields form={form} prefix="manager" />
        <SiteMemberFields form={form} prefix="contractor" />
        <SiteMemberFields form={form} prefix="supervisor" />

        <div className="col-span-2 flex justify-end">
          <Button
            type="submit"
            className="flex gap-2"
            // disabled={form.formState.isSubmitting}
          >
            Save
            <LucideLoader2
              className={cn(
                "animate-spin w-4 h-4",
                form.formState.isSubmitting ? "" : "hidden",
              )}
            />
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function EditSiteMembersButtonPopup() {
  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      console.log("setting ", name, value);
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )
  return (
    <Dialog
      open={searchParams.get("m") === "1"}
      onOpenChange={(o) =>
        router.replace(pathname + "?" + createQueryString("m", o ? "1" : "0"))
      }
    >
      <DialogTrigger asChild>
        <Button>Edit Members</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Key Site Member Information</DialogTitle>
        </DialogHeader>
        <EditSiteMembersForm />
      </DialogContent>
    </Dialog>
  );
}

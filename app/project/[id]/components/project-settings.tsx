"use client"

import { redirect } from "next/navigation";
import { deleteFullProject } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Separator } from "@/components/ui/separator";





import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FormSchema = z.object({
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})

export function SwitchForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      security_emails: true,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Email Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full space-y-6">
            <div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="marketing_emails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Marketing emails
                        </FormLabel>
                        <FormDescription>
                          Receive emails about new products, features, and more.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="security_emails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Security emails</FormLabel>
                        <FormDescription>
                          Receive emails about your account security.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled
                          aria-readonly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex w-full place-items-end justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}











export default function ProjectSettings({ project, }: { project: any }) {

  function clickDeleteProject() {
    // dont await?
    // maybe we want confirmation that it's been deleted though
    deleteFullProject(project.id);
    redirect('/projects');
  }

  return (
    <div className="flex flex-col space-y-4">

      <SwitchForm />

      <Collapsible className="border rounded-md" defaultOpen={true}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-start rounded-none">
            <pre>Raw Database Data</pre>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2">
          <Separator />
          <pre className="px-4 py-2 overflow-hidden">
            {JSON.stringify(project, null, 2)}
          </pre>
        </CollapsibleContent>
      </Collapsible>

      <Card className="bg-red-100">
        <CardHeader>
          <CardTitle>
            Destructive Area
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription>
            <p>Requesting deletion will request a manual deletion of all this projects after 30 days.</p>
            <p>We will ask you to confirm the deletion via email.</p>
            <p>The button does not work atm</p>
          </CardDescription>
          <div className="flex space-x-4">
            <Button variant="destructive">Request Project Deletion</Button>
            <Button variant="destructive" onClick={clickDeleteProject}>Delete Project</Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
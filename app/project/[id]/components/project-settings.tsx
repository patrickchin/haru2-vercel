"use client";

import { redirect } from "next/navigation";
import { createProjectTasks, deleteFullProject } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

export default function ProjectSettings({ project }: { project: any }) {
  function clickDeleteProject() {
    // dont await?
    // maybe we want confirmation that it's been deleted though
    deleteFullProject(project.id)
      .then((v) => {
        toast({ description: "Project deleted succesfully." });
      })
      .catch((v) => {
        toast({ description: "Project failed to be deleted." });
      });
    redirect("/projects");
  }

  function submitToast() {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">this is a toast</code>
        </pre>
      ),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Dev Area</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => createProjectTasks(project.id)}
            >
              Create Default Project Tasks
            </Button>
            <Button variant="secondary" onClick={submitToast}>
              Show Toast
            </Button>
          </div>

          <div className="border rounded-md">
            <div className="rounded-none px-4 py-2 bg-accent text-sm">
              Raw Database Data
            </div>
            <Separator />
            <pre className="px-4 py-2 overflow-hidden">
              {JSON.stringify(project, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-500 border-2 bg-red-50">
        <CardHeader>
          <CardTitle>Destructive Area</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription>
            Requesting deletion will request a manual deletion of all this
            projects after 30 days.
          </CardDescription>
          <CardDescription>
            We will ask you to confirm the deletion via email.
          </CardDescription>
          <CardDescription>
            TODO Make user confirm delete project
          </CardDescription>
          <div className="flex space-x-4">
            <Button variant="destructive" disabled>
              Request Project Deletion
            </Button>
            <Button variant="destructive" disabled onClick={clickDeleteProject}>
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

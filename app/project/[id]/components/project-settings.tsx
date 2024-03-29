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

export default function ProjectSettings({ project, }: { project: any }) {

  function clickDeleteProject() {
    // dont await?
    // maybe we want confirmation that it's been deleted though
    deleteFullProject(project.id);
    redirect('/projects');
  }

  return (
    <div className="space-y-4">

      <Collapsible className="border rounded-md">
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

      <Button variant="destructive" onClick={clickDeleteProject}>
        Delete Project
      </Button>

    </div>
  );
}
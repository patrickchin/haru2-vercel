"use client"

import { Button } from "@/components/ui/button";
import { deleteFullProject } from "@/lib/actions";
import { redirect } from "next/navigation";

export default function ProjectSettings({ project, }: { project: any }) {

  function clickDeleteProject() {
    // dont await?
    // maybe we want confirmation that it's been deleted though
    deleteFullProject(project.id);
    redirect('/projects');
  }

  return (
    <Button variant="destructive" onClick={clickDeleteProject}>
      Delete Project
    </Button>
  );
}
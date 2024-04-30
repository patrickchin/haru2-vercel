"use client";

import { DesignProject } from "@/lib/types";
import { Button } from "./ui/button";
import { LucidePencil, CheckSquare, XSquare } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { updateProjectTitle } from "@/lib/actions";
import { toast } from "@/components/ui/use-toast";
import { redirect } from "next/navigation";

export default function EditableTitle({ project }: { project: DesignProject }) {
  const [title, setTitle] = useState(project.title || "Untitled");
  const [editing, setEditing] = useState(false);

  function clickUpdateProject() {
    updateProjectTitle(project.id, title)
      .then((v) => {
        setEditing(false);
        toast({ description: "Project updated succesfully." });
      })
      .catch((v) => {
        toast({ description: "Project failed to be updated." });
      });
    redirect("/projects");
  }

  if (!editing) {
    return (
      <h3 className="flex items-center gap-1">
        Project {project.id} - {title || "Untitled"}
        <Button
          variant="ghost"
          className="p-2 text-muted-foreground"
          onClick={() => setEditing(true)}
        >
          <LucidePencil className="fg-muted w-4 p-0" />
        </Button>
      </h3>
    );
  }

  return (
    <h3 className="flex items-center">
      <span className="whitespace-nowrap">Project {project.id} - </span>
      <Input
        defaultValue={title}
        disabled={!editing}
        className="text-2xl text-black disabled:text-black"
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button
        variant="ghost"
        className="p-2 text-muted-foreground"
        onClick={() => setEditing(!editing)}
        disabled
      >
        <LucidePencil className="fg-muted w-4 p-0 opacity-40 hover:opacity-100" />
      </Button>
      <Button
        variant="ghost"
        className="p-2 text-muted-foreground"
        onClick={clickUpdateProject}
      >
        <CheckSquare className="fg-muted w-4 p-0" />
      </Button>
      <Button
        variant="ghost"
        className="p-2 text-muted-foreground"
        onClick={() => setEditing(!editing)}
      >
        <XSquare className="fg-muted w-4 p-0" />
      </Button>
    </h3>
  );
}

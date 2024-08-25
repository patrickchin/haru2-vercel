"use client";

import { DesignProject } from "@/lib/types";
import { Button } from "./ui/button";
import { LucidePencil, CheckSquare, XSquare } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { updateProject } from "@/lib/actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function EditableTitle({ project }: { project: DesignProject }) {
  const router = useRouter();

  const [title, setTitle] = useState(project.title || "Untitled");
  const [originalTitle, setOriginalTitle] = useState(
    project.title || "Untitled",
  );
  const [editing, setEditing] = useState(false);

  async function clickUpdateProject() {
    try {
      await updateProject(project.id, { title });
      setOriginalTitle(title);
      setEditing(false);
      toast({ description: "Project updated succesfully." });
      router.refresh();
    } catch (error) {
      toast({ description: "Project failed to be updated." });
    }
  }

  function cancelEditing() {
    setTitle(originalTitle); // Revert to original title
    setEditing(false);
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
          <LucidePencil strokeWidth={3} className="w-4 p-0" />
        </Button>
      </h3>
    );
  }

  return (
    <h3 className="flex gap-2 items-center">
      <span className="whitespace-nowrap">Project {project.id} - </span>
      <Input
        defaultValue={title}
        maxLength={255}
        disabled={!editing}
        className="text-2xl text-black disabled:text-black"
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button variant="outline" className="p-2" onClick={clickUpdateProject}>
        <CheckSquare className="w-4 p-0" />
      </Button>
      <Button variant="outline" className="p-2" onClick={cancelEditing}>
        <XSquare className="w-4 p-0" />
      </Button>
    </h3>
  );
}

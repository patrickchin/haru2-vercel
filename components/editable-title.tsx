"use client";

import { DesignProject } from "@/lib/types";
import { Button } from "./ui/button";
import { LucidePencil } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";

export default function EditableTitle({ project }: { project: DesignProject }) {
  const [title, setTitle] = useState(project.title || "Untitled");
  const [editing, setEditing] = useState(false);

  // if (!editing) {
  //   return (
  //     <h3 className="flex items-center gap-1">
  //       {project.title || "Untitled"}
  //       <Button
  //         variant="ghost"
  //         className="p-2 text-muted-foreground"
  //         onClick={() => setEditing(true)}
  //       >
  //         <LucidePencil className="fg-muted w-4 p-0" />
  //       </Button>
  //     </h3>
  //   );
  // }

  return (
    <h3 className="flex items-center gap-1">
      <Input defaultValue={title} disabled={!editing}
      className="text-2xl text-black disabled:text-black"
      />
      <Button
        variant="ghost"
        className="p-2 text-muted-foreground"
        onClick={() => setEditing(!editing)}
      >
        <LucidePencil className="fg-muted w-4 p-0 opacity-40 hover:opacity-100" />
      </Button>
    </h3>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { updateProject } from "@/lib/actions";
import { DesignProject } from "@/lib/types";

import { CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";

export default function EditableDescription({
  project,
}: {
  project: DesignProject;
}) {
  const router = useRouter();

  const [description, setDescription] = useState(
    project.description || "Untitled",
  );
  const [originalDescription, setOriginalDescription] = useState(
    project.description || "Untitled",
  );
  const [editing, setEditing] = useState(false);

  async function clickUpdateProject() {
    try {
      const updates = { description: description };
      const result = await updateProject(project.id, updates);
      setOriginalDescription(result?.description || description);
      setEditing(false);
      toast({ description: "Project updated succesfully." });
      router.refresh();
    } catch (error) {
      toast({ description: "Project failed to be updated." });
    }
  }

  function cancelEditing() {
    setDescription(originalDescription); // Revert to original title
    setEditing(false);
  }

  return (
    <>
      <CardHeader>
        <div className="flex items-center gap-1">
          Description
          {!editing && (
            <Button
              variant="ghost"
              className="p-2 text-muted-foreground"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="whitespace-pre-line">
          {!editing ? (
            description
          ) : (
            <Textarea
              defaultValue={description}
              placeholder="Tell us a little bit about your project"
              className="resize-y h-svh"
              onChange={(e) => setDescription(e.target.value)}
            />
          )}
        </CardDescription>
        {editing && (
          <div className="mt-6 flex items-center justify-end gap-x-3">
            <Button
              variant="default"
              className="p-2"
              onClick={clickUpdateProject}
            >
              Save
            </Button>
            <Button variant="secondary" className="p-2" onClick={cancelEditing}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </>
  );
}

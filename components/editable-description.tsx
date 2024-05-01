"use client";

import { useState } from "react";
import { LucidePencil, CheckSquare, XSquare } from "lucide-react";
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
      await updateProject(project.id, updates);
      setOriginalDescription(description);
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
          {!editing ? (
            <Button
              variant="ghost"
              className="p-2 text-muted-foreground"
              onClick={() => setEditing(true)}
            >
              <LucidePencil strokeWidth={3} className="w-4 p-0" />
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="p-2"
                onClick={clickUpdateProject}
              >
                <CheckSquare className="w-4 p-0" />
              </Button>
              <Button variant="outline" className="p-2" onClick={cancelEditing}>
                <XSquare className="w-4 p-0" />
              </Button>
            </>
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
              className="resize-y h-36"
              onChange={(e) => setDescription(e.target.value)}
            />
          )}
        </CardDescription>
      </CardContent>
    </>
  );
}

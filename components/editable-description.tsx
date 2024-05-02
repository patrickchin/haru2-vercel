"use client";

import { useEffect, useRef, useState } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && editing) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.style.overflowY = "hidden";
    }
  }, [editing, description]);

  const handleChangeDescription = (event: any) => {
    setDescription(event.target.value);
    const scrollY = window.scrollY;
    // Automatically resize the textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset the height so the calculation is correct
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height

      window.scrollTo(window.scrollX, scrollY);
    }
  };

  async function clickUpdateProject() {
    try {
      const updates = { description: description };
      const result = await updateProject(project.id, updates);
      setOriginalDescription((prev) => result?.description || description);
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
        <div className="flex justify-between items-center gap-1">
          Description
          {!editing && (
            <Button
              variant="secondary"
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
            <textarea
              ref={textareaRef}
              className="w-full text-slate-600 bg-white border border-slate-300 appearance-none rounded-lg px-3.5 py-2.5 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Tell us a little bit about your project"
              required
              value={description}
              onChange={handleChangeDescription}
            ></textarea>
          )}
        </CardDescription>
        {editing && (
          <div className="mt-6 flex items-center justify-end gap-x-3">
            <Button variant="secondary" className="p-2" onClick={cancelEditing}>
              Cancel
            </Button>
            <Button
              variant="default"
              className="p-2"
              onClick={clickUpdateProject}
            >
              Save
            </Button>
          </div>
        )}
      </CardContent>
    </>
  );
}

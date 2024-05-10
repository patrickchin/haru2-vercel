"use client";

import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LucideDownload,
  LucideLoader2,
  LucideUpload,
  LucideView,
  LucideX,
} from "lucide-react";
import assert from "assert";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { DesignFile, DesignTaskUserComment } from "@/lib/types";
import {
  addTaskComment,
  addTaskFile,
  deleteFile,
  getTaskCommentsAndFiles,
} from "@/lib/actions";

async function updateCommentsAndFiles(
  taskId: number,
  setUpdatedComments: Dispatch<SetStateAction<DesignTaskUserComment[]>>,
  setUpdatedFiles: Dispatch<SetStateAction<DesignFile[]>>,
) {
  const [newComments, newFiles] = (await getTaskCommentsAndFiles(taskId)) || [
    undefined,
    undefined,
  ];
  if (newComments) setUpdatedComments(newComments);
  if (newFiles) setUpdatedFiles(newFiles);
}

function LoadNewComments({
  taskId,
  setUpdatedComments,
  setUpdatedFiles,
}: {
  taskId: number;
  setUpdatedComments: Dispatch<SetStateAction<DesignTaskUserComment[]>>;
  setUpdatedFiles: Dispatch<SetStateAction<DesignFile[]>>;
}) {
  const [loadingNewComments, setLoadingNewComments] = useState(false);

  return (
    <Button
      variant="secondary"
      disabled={loadingNewComments}
      onClick={async () => {
        setLoadingNewComments(true);
        updateCommentsAndFiles(taskId, setUpdatedComments, setUpdatedFiles);
        setLoadingNewComments(false);
      }}
      className="flex flex-row gap-3"
    >
      Check for New Comments
      <LucideLoader2
        className={cn("animate-spin h-4", loadingNewComments ? "" : "hidden")}
      />
    </Button>
  );
}

function CommentAttachments({
  attachments,
}: {
  attachments: DesignFile[];
}) {
  if (!attachments || attachments.length == 0) return null;

  return (
    <ul className="flex gap-4 flex-wrap">
      {attachments.map((att) => {
        return (
          <li
            key={att.id}
            className="flex px-2 py-0.5 text-sm gap-2 border rounded items-center"
          >
            <span>{att.filename}</span>
            <div>
              {false && (
                <Button
                  variant="link"
                  className="h-3 p-0 cursor-not-allowed"
                >
                  <LucideView className="h-3" />
                </Button>
              )}
              <Button variant="link" className="h-5 p-0">
                <Link href={att.url || "#"} target="_blank">
                  <LucideDownload className="h-3" />
                </Link>
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function CommentsList({
  comments,
  attachments,
}: {
  comments: DesignTaskUserComment[];
  attachments: DesignFile[];
}) {
  const pathname = usePathname();
  const [fragment, setFragment] = useState(
    typeof window !== "undefined" ? window.location.hash : "",
  );

  const groupedAttachments: Record<number, DesignFile[]> = {};
  attachments.forEach((att) => {
    const key: number | null = att.commentid;
    if (key === null) return;
    if (!Object.keys(groupedAttachments).includes(key.toString()))
      groupedAttachments[key] = [];
    groupedAttachments[key].push(att);
  });

  return (
    <ul className="">
      {comments.map((c, i) => (
        <li
          id={`comment-${c.taskcomments1.id}`}
          key={i}
          className={cn(
            "flex gap-3 p-3 items-start justify-center border-b hover:bg-accent",
            fragment === `#comment-${c.taskcomments1.id}` ? "bg-yellow-50" : "",
          )}
        >
          <div className="pt-2">
            <Avatar>
              <AvatarFallback />
              <AvatarImage src={`/tmp/avatar${(c.users1?.id || 0) % 12}.png`} />
            </Avatar>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-row gap-4 items-end">
              <span className="font-bold">{c.users1?.name}</span>
              {/* <span className="text-sm">{c.taskcomments1.createdat}</span> */}
              <Link
                href={{
                  pathname: pathname,
                  hash: `#comment-${c.taskcomments1.id}`,
                }}
                replace={true}
                className="text-sm text-muted-foreground"
                onClick={(e) => setFragment(`#comment-${c.taskcomments1.id}`)}
              >
                <time
                  dateTime={(
                    c.taskcomments1.createdat as unknown as Date
                  ).toISOString()}
                  suppressHydrationWarning
                >
                  {(
                    c.taskcomments1.createdat as unknown as Date
                  ).toLocaleString()}
                </time>
              </Link>
            </div>

            {attachments.length > 0 && (
              <CommentAttachments
                attachments={groupedAttachments[c.taskcomments1.id]}
              />
            )}

            <div className="whitespace-pre-wrap break-words">
              {c.taskcomments1.comment}
            </div>
          </div>
        </li>
      ))}
      {comments.length == 0 && (
        <li>There are currently no coments to display</li>
      )}
    </ul>
  );
}

function AddCommentFormInternal() {
  const formStatus = useFormStatus();
  return (
    <>
      <Textarea
        className="text-base h-24"
        placeholder="Add a comment ..."
        name="comment"
        disabled={formStatus.pending}
      />
      <div className="flex justify-end gap-4">
        <Button type="reset" variant="secondary" disabled={formStatus.pending}>
          Cancel
        </Button>
        <Button variant="default" disabled={formStatus.pending}>
          Save
          <LucideLoader2
            className={cn(
              "animate-spin h-4",
              formStatus.pending ? "" : "hidden"
            )}
          />
        </Button>
      </div>
    </>
  );
}

function AddCommentForm({
  taskId,
  attachments,
  setAttachments,
  setUpdatedComments,
  setUpdatedFiles,
}: {
  taskId: number;
  attachments: DesignFile[];
  setAttachments: Dispatch<SetStateAction<DesignFile[]>>;
  setUpdatedComments: Dispatch<SetStateAction<DesignTaskUserComment[]>>;
  setUpdatedFiles: Dispatch<SetStateAction<DesignFile[]>>;
}) {
  const attachmentIds: number[] = attachments.map((f) => f.id);

  async function formSubmitNewComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const comment = data.get("comment");
    if (!comment) return;
    e.currentTarget.reset();
    const [newComments, newFiles] = (await addTaskComment(
      taskId,
      comment as string,
      attachmentIds,
    )) || [undefined, undefined];
    if (newComments) setUpdatedComments(newComments);
    if (newFiles) setUpdatedFiles(newFiles);
    setAttachments([]);
  }

  return (
    <form onSubmit={formSubmitNewComment} className="flex flex-col gap-4">
      <AddCommentFormInternal />
    </form>
  );
}

function AttachmentList({
  currentAttachments,
  setCurrentAttachments,
}: {
  currentAttachments: DesignFile[];
  setCurrentAttachments: Dispatch<SetStateAction<DesignFile[]>>;
}) {

  function removeAttachment(fileId: number) {
    setCurrentAttachments((list) => list.filter((f) => f.id !== fileId));
    deleteFile(fileId);
  }

  return (
    <ul className="flex gap-1 flex-wrap">
      {currentAttachments.map((att, i) => (
        <li
          key={i}
          className={cn(
            "flex gap-1 items-center text-sm border px-2 py-0.5 rounded",
          )}
        >
          <span>{att.filename}</span>
          <Button
            variant="ghost"
            className="h-3 px-0 py-3"
            onClick={() => removeAttachment(att.id)}
          >
            <LucideX className="h-3" />
          </Button>
        </li>
      ))}
    </ul>
  );
}

function UploadAttachment({
  taskId,
  setCurrentAttachments,
}: {
  taskId: number;
  setCurrentAttachments: Dispatch<SetStateAction<DesignFile[]>>;
}) {
  const uploadFileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  async function onChangeUploadFile(e: ChangeEvent<HTMLInputElement>) {
    const targetFiles = e.currentTarget.files;
    if (!targetFiles || targetFiles.length <= 0) return;

    setIsUploading(true);

    assert(targetFiles.length == 1);
    const file = targetFiles.item(0);
    assert(file);

    // server action arguments can only be primatives or FormData
    const data = new FormData();
    data.set("file", file);
    const newFile = await addTaskFile(taskId, data);
    if (newFile) setCurrentAttachments((l) => [...l, newFile]);

    e.target.value = "";
    setIsUploading(false);
  }

  return (
    <div className="flex justify-end">
      <Input
        type="file"
        id="upload-comment-file"
        className="hidden"
        ref={uploadFileInputRef}
        onChange={onChangeUploadFile}
        disabled={isUploading}
      />
      <Button asChild type="button" variant="secondary" disabled={isUploading}>
        <Label
          htmlFor="upload-comment-file"
          className={cn(
            "space-x-4",
            isUploading ? "cursor-progress" : "cursor-pointer",
          )}
        >
          {isUploading ? (
            <>
              <LucideLoader2 className="animate-spin h-4" />
              Uploading
            </>
          ) : (
            <>
              <LucideUpload className="h-4" />
              Upload Attachment
            </>
          )}
        </Label>
      </Button>
    </div>
  );
}

export default function TaskCommentsClient({
  taskId,
  comments,
  files,
}: {
  taskId: number;
  comments: DesignTaskUserComment[];
  files: DesignFile[];
}) {
  // Tbh these two should be in the same state as they should be updated together
  const [updatedComments, setUpdatedComments] = useState(comments);
  const [updatedFiles, setUpdatedFiles] = useState(files);
  
  // only the files to be attached
  const [currentAttachments, setCurrentAttachments] = useState<DesignFile[]>([]);

  return (
    <Card>
      <CardHeader className="font-bold">Comments</CardHeader>
      <CardContent className="flex flex-col gap-4 px-6 py-6">
        {/* <Button variant="secondary">Load all older Comments</Button> */}

        <CommentsList comments={updatedComments} attachments={updatedFiles} />

        <LoadNewComments
          taskId={taskId}
          setUpdatedComments={setUpdatedComments}
          setUpdatedFiles={setUpdatedFiles}
        />

        <Separator />

        <AttachmentList
          currentAttachments={currentAttachments}
          setCurrentAttachments={setCurrentAttachments}
        />

        <UploadAttachment
          taskId={taskId}
          setCurrentAttachments={setCurrentAttachments}
        />

        <AddCommentForm
          taskId={taskId}
          attachments={currentAttachments}
          setAttachments={setCurrentAttachments}
          setUpdatedComments={setUpdatedComments}
          setUpdatedFiles={setUpdatedFiles}
        />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
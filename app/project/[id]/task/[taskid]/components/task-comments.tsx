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
  LucideLink,
  LucideLoader2,
  LucideSend,
  LucideUpload,
  LucideView,
  LucideX,
} from "lucide-react";
import assert from "assert";
import useSWR, { KeyedMutator } from "swr";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DesignUserAvatar } from "@/components/user-avatar";

import { cn } from "@/lib/utils";
import { DesignFile, DesignTaskUserComment, DesignUserBasic } from "@/lib/types";
import {
  addTaskComment,
  addTaskFile,
  deleteFile,
  getTaskCommentsAndFiles,
} from "@/lib/actions";

function CommentAttachments({ attachments }: { attachments: DesignFile[] }) {
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
                <Button variant="link" className="h-3 p-0 cursor-not-allowed">
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
            <DesignUserAvatar user={c.users2 as DesignUserBasic} />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-row gap-4 items-end">
              <span className="font-bold">{c.users2?.name}</span>
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

function AddCommentFormInternal({
  taskId,
  setCurrentAttachments,
}: {
  taskId: number;
  setCurrentAttachments: Dispatch<SetStateAction<DesignFile[]>>;
}) {
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
        <UploadAttachment
          taskId={taskId}
          setCurrentAttachments={setCurrentAttachments}
        />

        <Button
          type="reset"
          variant="secondary"
          className="hidden"
          disabled={formStatus.pending}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          className="gap-x-2"
          disabled={formStatus.pending}
        >
          Send{" "}
          {formStatus.pending ? (
            <LucideLoader2
              className={cn(
                "animate-spin h-4",
                formStatus.pending ? "" : "hidden",
              )}
            />
          ) : (
            <LucideSend className="w-4" />
          )}
        </Button>
      </div>
    </>
  );
}

function AddCommentForm({
  taskId,
  attachments,
  setAttachments,
  swrMutateComments,
}: {
  taskId: number;
  attachments: DesignFile[];
  setAttachments: Dispatch<SetStateAction<DesignFile[]>>;
  swrMutateComments: KeyedMutator<any>; // getting the Data type is hard
}) {
  const attachmentIds: number[] = attachments.map((f) => f.id);

  async function formSubmitNewComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const comment = data.get("comment");
    if (!comment) return;

    e.currentTarget.reset();
    const userCommentFiles = addTaskComment(
      taskId,
      comment as string,
      attachmentIds,
    );
    swrMutateComments(userCommentFiles, { revalidate: false });

    setAttachments([]);
  }

  return (
    <form onSubmit={formSubmitNewComment} className="flex flex-col gap-4">
      <AddCommentFormInternal
        taskId={taskId}
        setCurrentAttachments={setAttachments}
      />
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
            "flex gap-1 items-center border border-foreground px-1 py-1 rounded",
          )}
        >
          <Button variant="ghost" className="h-6 w-6 px-0">
            <LucideLink className="h-3" />
          </Button>
          <span className="align-top">{att.filename}</span>
          <Button variant="ghost" className="h-6 w-6 px-0">
            <LucideX className="h-3" onClick={() => removeAttachment(att.id)} />
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
            "gap-x-2",
            isUploading ? "cursor-progress" : "cursor-pointer",
          )}
        >
          {isUploading ? (
            <>
              Uploading
              <LucideLoader2 className="animate-spin w-4" />
            </>
          ) : (
            <>
              Add Attachment
              <LucideUpload className="w-4" />
            </>
          )}
        </Label>
      </Button>
    </div>
  );
}

export default function TaskCommentsClient({ taskId }: { taskId: number }) {

  const { data, error, mutate } = useSWR(
    `/api/task/${taskId}`, // api route doesn't really exist
    () => {
      console.log("getting the data again", taskId);
      return getTaskCommentsAndFiles(taskId);
    },
  );
  const userComments: DesignTaskUserComment[] = (data && data[0]) || [];
  const commentFiles: DesignFile[] = (data && data[1]) || [];

  // only the files to be attached
  const [currentAttachments, setCurrentAttachments] = useState<DesignFile[]>(
    [],
  );

  return (
    <Card>
      <CardHeader className="font-bold">Comments</CardHeader>
      <CardContent className="flex flex-col gap-4 px-6 py-6">
        {/* <Button variant="secondary">Load all older Comments</Button> */}

        <CommentsList comments={userComments} attachments={commentFiles} />

        <AttachmentList
          currentAttachments={currentAttachments}
          setCurrentAttachments={setCurrentAttachments}
        />

        <AddCommentForm
          taskId={taskId}
          attachments={currentAttachments}
          setAttachments={setCurrentAttachments}
          swrMutateComments={mutate}
        />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

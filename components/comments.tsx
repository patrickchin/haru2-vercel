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
import useSWR, { KeyedMutator } from "swr";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DesignUserAvatar } from "@/components/user-avatar";

import { cn } from "@/lib/utils";
import { DesignFile, DesignComment, DesignCommentSection } from "@/lib/types";
import * as Actions from "@/lib/actions";
import { uploadFile } from "@/lib/utils/upload";

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
  comments: DesignComment[];
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
      {comments &&
        comments.map((c: DesignComment, i: number) => (
          <li
            id={`comment-${c.id}`}
            key={i}
            className={cn(
              "flex gap-3 p-3 items-start justify-center border-b hover:bg-accent",
              fragment === `#comment-${c.id}` ? "bg-yellow-50" : "",
            )}
          >
            <div className="pt-2">
              <DesignUserAvatar user={c.user ? { ...c.user } : undefined} />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <div className="flex flex-row gap-4 items-end">
                <span className="font-bold">
                  {c.user?.name ?? "<Invalid User>"}
                </span>
                <Link
                  href={{
                    pathname: pathname,
                    hash: `#comment-${c.id}`,
                  }}
                  replace={true}
                  className="text-sm text-muted-foreground"
                  onClick={(e) => setFragment(`#comment-${c.id}`)}
                >
                  {c.createdAt && (
                    <time
                      dateTime={new Date(c.createdAt).toISOString()}
                      suppressHydrationWarning
                    >
                      {new Date(c.createdAt).toLocaleString()}
                    </time>
                  )}
                </Link>
              </div>

              {attachments.length > 0 && c.id && (
                <CommentAttachments attachments={groupedAttachments[c.id]} />
              )}

              <div className="whitespace-pre-wrap break-words">{c.comment}</div>
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
  commentSection,
  setCurrentAttachments,
}: {
  commentSection: DesignCommentSection;
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
          commentSection={commentSection}
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
  commentSection,
  swrMutateComments,
}: {
  commentSection: DesignCommentSection;
  swrMutateComments: KeyedMutator<any>; // getting the Data type is hard
}) {
  const [attachments, setAttachments] = useState<DesignFile[]>([]);
  const attachmentIds: number[] = attachments.map((f) => f.id);

  async function formSubmitNewComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const commentString = data.get("comment") as string;
    if (!commentString) return;

    const userCommentFiles = Actions.addComment({
      commentSection,
      commentString,
      attachmentIds,
    });
    swrMutateComments(userCommentFiles, { revalidate: false });

    e.currentTarget.reset();
    setAttachments([]);
  }

  return (
    <>
      <AttachmentList
        currentAttachments={attachments}
        setCurrentAttachments={setAttachments}
      />

      <form onSubmit={formSubmitNewComment} className="flex flex-col gap-4">
        <AddCommentFormInternal
          commentSection={commentSection}
          setCurrentAttachments={setAttachments}
        />
      </form>
    </>
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
    Actions.deleteFile(fileId);
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
  commentSection,
  setCurrentAttachments,
}: {
  commentSection: DesignCommentSection;
  setCurrentAttachments: Dispatch<SetStateAction<DesignFile[]>>;
}) {
  const uploadFileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  async function onChangeUploadFile(e: ChangeEvent<HTMLInputElement>) {
    const targetFiles = e.currentTarget.files;
    if (!targetFiles || targetFiles.length <= 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(targetFiles)) {
        let newFile;
        // surely this could be better
        if (commentSection.taskid) {
          newFile = await uploadFile({ file, taskId: commentSection.taskid });
        } else if (commentSection.projectid) {
          newFile = await uploadFile({
            file,
            projectId: commentSection.projectid,
          });
        } else {
          throw new Error("Invalid comment section");
        }
        if (newFile) setCurrentAttachments((l) => [...l, newFile]);
      }
      e.target.value = "";
    } finally {
      setIsUploading(false);
    }
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
        multiple
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
              Add Attachment <LucideUpload className="w-4" />
            </>
          )}
        </Label>
      </Button>
    </div>
  );
}

export function TaskComments({ taskId }: { taskId: number }) {
  const { data, error, mutate } = useSWR(
    `/api/task/${taskId}/commments`, // api route doesn't really exist
    () => {
      return Actions.getTaskCommentsAndFiles(taskId);
    },
  );
  if (!data) return null;
  const commentSection: DesignCommentSection = data[0];
  const userComments: DesignComment[] = data[1] || [];
  const commentFiles: DesignFile[] = data[2] || [];
  if (!commentSection) return null;
  return (
    <>
      <CommentsList comments={userComments} attachments={commentFiles} />
      <AddCommentForm
        commentSection={commentSection}
        swrMutateComments={mutate}
      />
    </>
  );
}

export function ProjectComments({ projectId }: { projectId: number }) {
  const { data, error, mutate } = useSWR(
    `/api/project/${projectId}/commments`, // api route doesn't really exist
    () => {
      return Actions.getProjectCommentsAndFiles(projectId);
    },
  );
  if (!data) return null;
  const commentSection: DesignCommentSection = data[0];
  const userComments: DesignComment[] = data[1] || [];
  const commentFiles: DesignFile[] = data[2] || [];
  if (!commentSection) return null;
  return (
    <>
      <CommentsList comments={userComments} attachments={commentFiles} />
      <AddCommentForm
        commentSection={commentSection}
        swrMutateComments={mutate}
      />
    </>
  );
}

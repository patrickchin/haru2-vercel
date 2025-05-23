import Image from "next/image";
import { HaruFile } from "@/lib/types";
import {
  LucidePause,
  LucidePlay,
  LucideTrash2,
  LucideVideo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import prettyBytes from "pretty-bytes";

// FileListTable component extracted from edit-sections.tsx
export function FileListTable({
  files,
  handleFileDelete,
  type,
}: {
  files: HaruFile[] | undefined;
  handleFileDelete: (file: HaruFile) => Promise<void>;
  type: string;
}) {
  return (
    <Table className="border rounded">
      <TableHeader>
        <TableRow className="[&>th]:border-r">
          <TableHead></TableHead>
          <TableHead></TableHead>
          <TableHead className="text-nowrap">File Name</TableHead>
          <TableHead className="text-nowrap">File Size</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files && files.length > 0 ? (
          files?.map((file, i) => (
            <TableRow key={file.id} className="[&>td]:border-r">
              <TableCell className="w-8 text-center">{i + 1}</TableCell>
              <TableCell className="w-12 h-12 overflow-ellipsis overflow-hidden text-nowrap p-0 relative">
                {file.type?.startsWith("image/") && (
                  <TooltipProvider
                    delayDuration={0}
                    disableHoverableContent={true}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full h-full relative flex justify-center items-center border-4 border-background">
                          <Image
                            src={file.url || ""}
                            alt={""}
                            width={40}
                            height={40}
                            className="object-cover absolute"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="">
                        <Image
                          src={file.url || ""}
                          alt={""}
                          width={384}
                          height={384}
                          className="object-contain"
                        />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {file.type?.startsWith("video/") && (
                  <div className="w-full h-full flex justify-center items-center">
                    <LucideVideo className="h-5 w-5" />
                  </div>
                )}
                {file.type?.startsWith("audio/") && (
                  <AudioPlayer url={file.url || ""} />
                )}
              </TableCell>
              <TableCell className="overflow-ellipsis overflow-hidden text-nowrap">
                {file.filename}
              </TableCell>
              <TableCell className="w-24 whitespace-nowrap bg-red-">
                {file.uploadedAt?.toDateString() ?? "--"}
              </TableCell>
              <TableCell className="w-24 whitespace-nowrap bg-red-">
                {file.uploader?.name ?? "--"}
              </TableCell>
              <TableCell className="w-24 whitespace-nowrap bg-red-">
                {file.filesize && prettyBytes(file.filesize)}
              </TableCell>
              <TableCell className="w-12">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="outline">
                      <LucideTrash2 className="h-3.5 w-3.5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Delete File</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete the file{" "}
                      <strong>{file.filename}</strong>?
                    </DialogDescription>
                    <div className="flex gap-2 justify-end">
                      <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          variant="destructive"
                          onClick={() => handleFileDelete(file)}
                        >
                          Delete
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={999} className="h-24 text-center">
              No {type}s have been uploaded
            </TableCell>
            <TableHead></TableHead>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

import { useRef, useState } from "react";

function AudioPlayer({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleReset = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.pause();
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <audio
        ref={audioRef}
        src={url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={handlePlayPause}
        onDoubleClick={handleReset}
        type="button"
      >
        {isPlaying ? (
          <LucidePause className="h-4 w-4" />
        ) : (
          <LucidePlay className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

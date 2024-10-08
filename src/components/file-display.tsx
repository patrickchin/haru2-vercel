"use client";

import { ReactNode, useState } from "react";
import { HaruFile } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { LucideRotate3D } from "lucide-react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";

export function FileDisplay({
  file,
  allow3d,
  className,
  controlsClassName,
  children,
}: {
  file?: HaruFile;
  allow3d?: boolean;
  className?: string;
  controlsClassName?: string;
  children?: ReactNode;
}) {
  const [view360, setView360] = useState(false);

  const isImage = file?.type?.startsWith("image/") ?? false;
  const isVideo = file?.type?.startsWith("video/");
  const isOther = !isImage && !isVideo;

  return (
    <div className={cn("flex items-center justify-center relative", className)}>
      {file && isImage ? (
        <>
          {view360 ? (
            <ReactPhotoSphereViewer
              src={file.url || ""}
              height={"100vh"}
              width={"100%"}
            ></ReactPhotoSphereViewer>
          ) : (
            <Image
              src={file.url || ""}
              alt={file.filename || "<Untitled>"}
              fill={true}
              className="object-contain w-full h-full"
            />
          )}
        </>
      ) : file && isVideo ? (
        <video controls className="max-w-full max-h-full w-full h-full">
          <source src={file.url || ""} type={file.type || ""} />
        </video>
      ) : (
        <div className="relative w-full h-full overflow-auto p-6">
          <pre className="absolute text-begin overflow-hidden">
            {JSON.stringify(file, undefined, 4)}
          </pre>
        </div>
      )}
      <div
        className={cn("absolute right-4 top-4 flex gap-2", controlsClassName)}
      >
        {children}
        {isImage && allow3d && (
          <Button
            className="rounded-full w-8 h-8"
            variant="outline"
            size="icon"
            onClick={() => setView360((a) => !a)}
          >
            <LucideRotate3D className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

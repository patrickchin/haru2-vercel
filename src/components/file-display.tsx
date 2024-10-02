"use client";

import { HaruFile } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { LucideMove3D } from "lucide-react";

const Pannellum: any = require("pannellum-react");

export function FileDisplay({
  file,
  className,
}: {
  file?: HaruFile;
  className?: string;
}) {
  const [is3d, setIs3d] = useState(false);
  return (
    <div className={cn("flex items-center justify-center relative", className)}>
      {file &&
        file.url &&
        file.url.length > 0 &&
        file.type &&
        (file.type?.startsWith("image/") ? (
          <>
            {is3d ? (
              <Pannellum.Pannellum height="100%" image={file.url} autoLoad />
            ) : (
              <Image
                src={file.url}
                alt={file.filename || "<Untitled>"}
                fill={true}
                className="object-scale-down w-full h-full"
              />
            )}
            <Button
              className="absolute rounded-full right-4 top-4 w-8 h-8"
              variant="outline"
              size="icon"
              onClick={() => setIs3d((a) => !a)}
            >
              <LucideMove3D className="w-4 h-4" />
            </Button>
          </>
        ) : file.type?.startsWith("video/") ? (
          <video controls className="max-w-full max-h-full w-full h-full">
            <source src={file.url} type={file.type} />
          </video>
        ) : (
          <div className="relative w-full h-full overflow-auto p-6">
            <pre className="absolute text-begin overflow-hidden">
              {JSON.stringify(file, undefined, 4)}
            </pre>
          </div>
        ))}
    </div>
  );
}

import { HaruFile } from "@/lib/types";
import Image from "next/image";


export function FileDisplay({ file }: { file?: HaruFile; }) {
  return (
    <div className="flex items-center justify-center relative h-full">
      {file &&
        file.url &&
        file.url.length > 0 &&
        file.type &&
        (file.type?.startsWith("image/") ? (
          <Image
            src={file.url}
            alt={file.filename || "<Untitled>"}
            fill={true}
            className="object-contain" />
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

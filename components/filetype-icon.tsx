import {
  LucideFile,
  LucideFileAxis3D,
  LucideFileImage,
  LucideFileText,
  LucideProps,
} from "lucide-react";

export default function FileTypeToIcon({
  type,
  ...props
}: { type: string } & LucideProps) {
  if (type.startsWith("image/")) return <LucideFileImage {...props} />;
  if (type.startsWith("text/")) return <LucideFileText {...props} />;
  if (type.startsWith("model/")) return <LucideFileAxis3D {...props} />;
  if (type.startsWith("application/")) return <LucideFileAxis3D {...props} />; // dwg files end up here
  return <LucideFile {...props} />;
}

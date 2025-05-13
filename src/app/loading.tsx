import { DefaultLayout } from "@/components/page-layouts";
import { LucideLoader2 } from "lucide-react";

export default function Loading() {
  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <LucideLoader2 className="animate-spin h-14 w-14 text-muted-foreground" />
      </div>
    </DefaultLayout>
  );
}

import { LucideInfo } from "lucide-react";
import { ReactNode } from "react";

export function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 bg-blue-50 border-2 p-4 rounded border-blue-200">
      <LucideInfo className="flex-none h-6 w-6" />
      <p className="flex items-center text-sm font-semibold align-bottom">
        {children}
      </p>
    </div>
  );
}

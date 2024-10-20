import { ReactNode } from "react";
import {
  LucideCheckCircle,
  LucideInfo,
  LucideMessageCircleWarning,
  LucideMessageCircleX,
} from "lucide-react";
import { cn } from "@/lib/utils";

// TODO make only one component and use different variants for different styles
// like the button component
export function ErrorBox({ children }: { children?: ReactNode }) {
  return (
    <div className="flex gap-3 bg-red-100 border-2 p-4 rounded border-red-300">
      <LucideMessageCircleX className="flex-none h-6 w-6" />
      <p className="flex items-center text-sm font-semibold align-bottom">
        {children}
      </p>
    </div>
  );
}

export function WarningBox({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 bg-yellow-50 border-2 p-4 rounded border-yellow-200",
        className,
      )}
    >
      <LucideMessageCircleWarning className="flex-none h-6 w-6" />
      <p className="text-inherit align-bottom">
        {children}
      </p>
    </div>
  );
}

export function InfoBox({ children }: { children?: ReactNode }) {
  return (
    <div className="flex gap-3 bg-blue-50 border-2 p-4 rounded border-blue-200">
      <LucideInfo className="flex-none h-6 w-6" />
      <p className="flex items-center text-sm font-semibold align-bottom">
        {children}
      </p>
    </div>
  );
}

export function GoodBox({ children }: { children?: ReactNode }) {
  return (
    <div className="flex gap-3 bg-green-50 border-2 p-4 rounded border-green-200">
      <LucideCheckCircle className="flex-none h-5 w-5" />
      <p className="flex items-center text-sm font-semibold align-bottom">
        {children}
      </p>
    </div>
  );
}

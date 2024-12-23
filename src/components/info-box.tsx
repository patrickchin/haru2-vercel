import {
  LucideCheckCircle,
  LucideInfo,
  LucideMessageCircleWarning,
  LucideMessageCircleX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const infoBoxVariants = cva(
  cn("flex gap-3 border-2 p-4 rounded text-sm text-foreground", "items-center"),
  {
    variants: {
      variant: {
        good:    "bg-green-50   border-green-200  dark:bg-green-950",
        info:    "bg-blue-50    border-blue-200   dark:bg-blue-950",
        warning: "bg-yellow-100 border-yellow-200 dark:bg-yellow-950",
        error:   "bg-red-100    border-red-400    dark:bg-red-950",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

export interface InfoBoxProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof infoBoxVariants> {}

const infoBoxIcons = {
  good: LucideCheckCircle,
  info: LucideInfo,
  warning: LucideMessageCircleWarning,
  error: LucideMessageCircleX,
};

export function InfoBox({ children, className, variant }: InfoBoxProps) {
  const Icon = infoBoxIcons[variant || "info"];
  return (
    <div className={cn(infoBoxVariants({ variant, className }))}>
      <div className="align-baseline">
        <Icon className="flex-none h-6 w-6" />
      </div>
      <div className="align-bottom">{children}</div>
    </div>
  );
}

export function ErrorBox(props: Omit<InfoBoxProps, "variant">) {
  return <InfoBox {...props} variant="error" />;
}

export function WarningBox(props: Omit<InfoBoxProps, "variant">) {
  return <InfoBox {...props} variant="warning" />;
}

export function GoodBox(props: Omit<InfoBoxProps, "variant">) {
  return <InfoBox {...props} variant="good" />;
}

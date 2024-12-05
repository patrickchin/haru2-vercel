import {
  LucideCheckCircle,
  LucideInfo,
  LucideMessageCircleWarning,
  LucideMessageCircleX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const infoBoxVariants = cva(
  "flex gap-3 text-foreground border-2 p-4 rounded text-sm text-foreground font-semibold",
  {
    variants: {
      variant: {
        good: "bg-green-50 border-green-200",
        info: "bg-blue-50 border-blue-200",
        warning: "bg-blue-50 border-blue-200",
        error: "bg-red-100 border-red-300",
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
      <Icon className="flex-none h-6 w-6" />
      <p className="align-bottom">{children}</p>
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

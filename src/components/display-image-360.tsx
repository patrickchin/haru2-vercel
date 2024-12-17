import Image from "next/image";
import { LucideLoader2, LucideRotate3D } from "lucide-react";
import { createContext, ReactNode, useContext, useState } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type DisplayImage360ContextProps = {
  toggle360: () => void;
  is360Enabled: boolean;
};

const DisplayImage360Context =
  createContext<DisplayImage360ContextProps | null>(null);

function useDisplayImage360() {
  const context = useContext(DisplayImage360Context);

  if (!context) {
    throw new Error(
      "useDisplayImage360 must be used within a <DisplayImage360 />",
    );
  }

  return context;
}

export function DisplayImage360({ children }: { children?: ReactNode }) {
  const [is360Enabled, set360Enabled] = useState(false);
  return (
    <DisplayImage360Context.Provider
      value={{ toggle360: () => set360Enabled((b) => !b), is360Enabled }}
    >
      {children}
    </DisplayImage360Context.Provider>
  );
}

export function Image360(
  props: React.ComponentProps<typeof Image> & { src: string },
) {
  const { is360Enabled } = useDisplayImage360();
  const [isLoading, setIsLoading] = useState(true);

  if (is360Enabled) {
    return (
      <ReactPhotoSphereViewer
        src={props.src}
        height={"100%"}
        width={"100%"}
      ></ReactPhotoSphereViewer>
    );
  }

  return (
    <>
      <LucideLoader2
        className={cn("animate-spin w-4 h-4", isLoading ? "" : "hidden")}
      />
      <Image
        {...props}
        onLoad={() => setIsLoading(false)}
        className={cn(props.className, isLoading ? "invisible" : "")}
      />
    </>
  );
}

export function Image360Toggle({ className }: { className?: string }) {
  const { toggle360 } = useDisplayImage360();

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute h-8 w-8 rounded-full",
        "top-4 right-4",
        className,
      )}
      onClick={() => toggle360()}
    >
      <LucideRotate3D className="w-4 h-4" />
      <span className="sr-only">View 360</span>
    </Button>
  );
}

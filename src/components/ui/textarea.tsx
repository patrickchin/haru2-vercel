import * as React from "react"

import { cn } from "@/lib/utils"
import { useAutoResizeTextarea } from "@/lib/hooks/use-auto-resize-textarea"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { autoResize?: boolean }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, ...props }, ref) => {
  const { textAreaRef } = useAutoResizeTextarea(ref, autoResize)
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
        ref={textAreaRef}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }

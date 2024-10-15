import * as React from "react"

export const useAutoResizeTextarea = (ref: React.ForwardedRef<HTMLTextAreaElement>, autoResize: boolean) => {

    const textAreaRef = React.useRef<HTMLTextAreaElement>(null)

    React.useImperativeHandle(ref, () => textAreaRef.current!);

    React.useEffect(() => {
        const ref = textAreaRef?.current

        const updateTextareaHeight = () => {
            if (ref && autoResize) {
              const scrollHeight = `${ref.scrollHeight}px`;
              const computedStyleMap = ref.computedStyleMap();
              const borderTopWidth = computedStyleMap.get("border-top-width")?.toString() ?? "0";
              const borderBottomWidth = computedStyleMap.get("border-bottom-width")?.toString() ?? "0";

              ref.style.height = `calc(${scrollHeight} + ${borderTopWidth} + ${borderBottomWidth})`;
            }
        }

        updateTextareaHeight()

        ref?.addEventListener("input", updateTextareaHeight)

        return () => ref?.removeEventListener("input", updateTextareaHeight)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { textAreaRef }
}
"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "./ui/button";

export interface BackButtonProps extends ButtonProps {}

export default function BackButton({ children, ...props }: BackButtonProps) {
  const router = useRouter();
  return (
    <Button onClick={router.back} {...props}>
      {children}
    </Button>
  );
}

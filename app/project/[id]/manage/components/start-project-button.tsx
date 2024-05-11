"use client";

import { Button } from "@/components/ui/button";
import * as Actions from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function StartProjectButton({
  projectId,
}: {
  projectId: number;
}) {
  const router = useRouter();

  return (
    <Button
      size="xl"
      className="text-lg font-normal"
      onClick={async () => {
        // TODO
        await Actions.startProject(projectId);
        router.push(`/project/${projectId}`);
      }}
    >
      Start Project
    </Button>
  );
}

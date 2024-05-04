"use client";

import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";
import * as Actions from "@/lib/actions";
import { revalidatePath } from "next/cache";
import { usePathname, useRouter } from "next/navigation";

export default function AddTeamMemberButton({
  projectId,
}: {
  projectId: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={async () => {
        const newTeam = await Actions.createProjectTeam(projectId, "legal");
        console.log(newTeam);
        // revalidatePath(pathname); // doesn't work
        router.refresh();
      }}
    >
      <LucidePlus className="h-4" />
      Add Team
    </Button>
  );
}
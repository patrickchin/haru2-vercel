import { WideLayout } from "@/components/page-layouts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getProject } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { getTaskSpecs } from "@/lib/db";
import { DesignProject, DesignTaskSpec } from "@/lib/types";
import { LucideMoveLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

async function ProjectManagement({ projectId }: { projectId: number }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const project: DesignProject | undefined = await getProject(projectId);
  if (project === undefined) notFound();
  const specs: DesignTaskSpec[] = await getTaskSpecs();

  const groupedSpecs: Record<string, DesignTaskSpec[]> = {};
  specs.forEach((spec) => {
    const key: string = spec.type || "other";
    if (!Object.keys(groupedSpecs).includes(key)) groupedSpecs[key] = [];
    groupedSpecs[key].push(spec);
  });

  return (
    <>
      <section className="flex gap-4 items-center w-screen mx-auto max-w-6xl pt-16 pb-8 px-4 sm:px-12">
        <Button asChild variant="secondary" className="shadow-md">
          <Link href={`/project/${projectId}`}>
            <LucideMoveLeft />
          </Link>
        </Button>
        <h3 className="grow">
          Project {project.id} - {project.title || session.user.email}
        </h3>
      </section>

      <section>
        <Card className="p-8">
          <CardContent className="flex gap-4 justify-center">
            {Object.keys(groupedSpecs).map((key) => (
              <div key={key} className="flex flex-col gap-4 w-[24rem]">
                <div className="p-6">
                  <h3>{key}</h3>
                </div>
                {groupedSpecs[key].map((taskSpec, i) => (
                  <Label
                    key={i}
                    htmlFor={`taskspec-${key}-${i}`}
                    className="flex justify-between gap-4 items-center py-4 px-6 border rounded-md font-normal"
                  >
                    <div className="space-y-2">
                      <h5>{taskSpec.title}</h5>
                      <div className="text-xs">{taskSpec.description}</div>
                    </div>
                    <div>
                      <Checkbox id={`taskspec-${key}-${i}`} />
                      {/* <Button variant="outline" className="p-1">
                    <LucidePlus className="h-5" />
                  </Button> */}
                    </div>
                  </Label>
                ))}
              </div>
            ))}
            {Object.keys(groupedSpecs).map((key) => (
              <div key={key} className="flex flex-col gap-4 w-[380px]">
                <div>
                  <h3>{key}</h3>
                </div>
                {groupedSpecs[key].map((taskSpec, i) => (
                  <Label
                    key={i}
                    htmlFor={`taskspec-${key}-${i}`}
                    className="flex justify-between gap-4 items-center py-4 px-6 border rounded-md font-normal"
                  >
                    <div className="space-y-2">
                      <h5>{taskSpec.title}</h5>
                      <div className="text-xs">{taskSpec.description}</div>
                    </div>
                    <div>
                      <Checkbox id={`taskspec-${key}-${i}`} />
                      {/* <Button variant="outline" className="p-1">
                    <LucidePlus className="h-5" />
                  </Button> */}
                    </div>
                  </Label>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  const projectId: number = parseInt(params.id);
  if (Number.isNaN(projectId)) {
    redirect("/project/not-found");
  }

  return (
    <WideLayout>
      <Suspense fallback={<p>Loading ...</p>}>
        <ProjectManagement projectId={projectId} />
      </Suspense>
    </WideLayout>
  );
}

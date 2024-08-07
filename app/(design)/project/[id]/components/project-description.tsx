import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { getProjectFiles } from "@/lib/actions";
import { Fragment, Suspense, useMemo } from "react";
import * as Lucide from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { buildingTypes } from "content/buildingTypes";
import EditableDescription from "@/components/editable-description";
import { DesignProject } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectComments } from "@/components/comments";

function ProjectDesignViewsFallback() {
  return <p>Loading images ...</p>;
}

async function ProjectDesignViews({ project }: { project: any }) {
  const imageUrlArray = await getProjectFiles(project.id);

  if (!imageUrlArray || imageUrlArray.length === 0) {
    return (
      <>
        <CardDescription className="whitespace-pre-line">
          {`You have no uploaded floor plans or 3D models yet.

        As progress is made on your designs, they will be displayed here.`}
        </CardDescription>
      </>
    );
  }

  return (
    <Carousel className="mx-12 min-h-32">
      <CarouselContent>
        {/* TODO click image to view or download */}
        {/* TODO name and description for each file */}
        {/* TODO preview files other than image files */}
        {imageUrlArray.map((image, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="border rounded-md p-4 space-y-3 hover:shadow-lg">
              <div className="border rounded-md aspect-video grid items-center justify-center bg-muted">
                {image.type?.startsWith("image/") ? (
                  <Lucide.FileImage />
                ) : (
                  <Lucide.File />
                )}
              </div>
              <div className="overflow-hidden text-center text-sm">
                {image.filename}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

async function ProjectProgressSummary({ project }: { project: any }) {
  const ncompleted = 13;
  const ntotal = 35;
  const pctcomplete = (100 * 13) / 53;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 justify-center items-center">
        <Progress value={33} className="w-5/6" indicatorColor="bg-gray-600" />
      </div>
      <CardDescription>
        Completed {ncompleted} of {ntotal} total tasks ({pctcomplete.toFixed(1)}{" "}
        %)
      </CardDescription>
    </div>
  );
}

export function ProjectInfoBar({ project }: { project: any }) {
  const displayNames = useMemo(() => {
    return new Intl.DisplayNames(["en"], { type: "region" });
  }, []);
  const country = displayNames.of(project.countrycode);

  return (
    <Card>
      <CardHeader className="text-sm text-muted-foreground">
        <ul className="inline-block">
          <li className="inline-block border-r px-2">
            <span className="font-bold">Project Id: </span>
            {project.id}
          </li>
          <li className="inline-block border-r px-2">
            <span className="font-bold">Owner: </span>
            {project.userid || "<unknown>"}
          </li>
          <li className="inline-block border-r px-2">
            <span className="font-bold">Country: </span>
            {country || "<unknown>"}
          </li>
          <li className="inline-block border-r px-2">
            <span className="font-bold">Industry: </span>
            {buildingTypes[project.type].type || "<unknown>"}
          </li>
          <li className="inline-block border-r px-2">
            <span className="font-bold">Type: </span>
            {project.subtype || "<unknown>"}
          </li>
          <li className="inline-block border-none px-2">
            <span className="font-bold">Created: </span>
            {project.createdat.toDateString() || "<unknown>"}
          </li>
        </ul>
      </CardHeader>
    </Card>
  );
}

export default async function ProjectDescription({
  project,
}: {
  project: DesignProject;
}) {
  return (
    <div className="flex flex-col gap-5">
      <ProjectInfoBar project={project} />

      {project.status === "pending" ? (
        <Card>
          <CardHeader>Status</CardHeader>
          <CardContent className="flex flex-col gap-4 text-3xl font-bold text-align-center p-24 pt-4 text-center">
            <div>Your project is waiting to be picked up.</div>
            <div>Expect a response within 3 working days.</div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-5">
            <Card>
              <CardHeader>Progress and Milestones</CardHeader>
              <CardContent>
                <Suspense fallback={<ProjectDesignViewsFallback />}>
                  <ProjectProgressSummary project={project} />
                </Suspense>
              </CardContent>
            </Card>

            <Card className="row-span-2">
              <CardHeader>Updates</CardHeader>
              <CardContent className="flex flex-col gap-4">
                <CardDescription>
                  Here you will see the latest updates to your project
                </CardDescription>
                <ScrollArea className="h-96 py-4 rounded bg-gray-50">
                  <ol className="space-y-2 pl-3 pr-4">
                    {Array.from(Array(20)).map((v, i) => (
                      <Fragment key={i}>
                        <li className="h-18 border rounded p-2 bg-background">
                          New Comment on Title Search
                        </li>
                        <li className="h-18 border rounded p-2 bg-background">
                          New File Uploaded to Design Drafts
                        </li>
                      </Fragment>
                    ))}
                  </ol>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <EditableDescription project={project} />
            </Card>
          </div>

          <Card>
            <CardHeader className="font-bold">Comments</CardHeader>
            <CardContent className="flex flex-col gap-4 px-6 py-6">
              <ProjectComments projectId={project.id} />
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </>
      )}

      {/* <Card>
        <CardHeader>Design Views</CardHeader>
        <CardContent>
          <Suspense fallback={<ProjectDesignViewsFallback />}>
            <ProjectDesignViews project={project} />
          </Suspense>
        </CardContent>
      </Card> */}
    </div>
  );
}

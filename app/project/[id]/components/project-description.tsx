import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { getProjectFiles } from "@/lib/actions";
import { Suspense, useMemo } from "react";
import * as Lucide from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { buildingTypes } from "content/buildingTypes";

function ProjectDesignViewsFallback() {
  return (<p>Loading images ...</p>);
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
      <CarouselContent className="p-4">
        {/* TODO click image to view or download */}
        {/* TODO name and description for each file */}
        {/* TODO preview files other than image files */}
        {imageUrlArray.map((image, index) => (
          <CarouselItem
            key={index}
            className="md:basis-1/2 lg:basis-1/3 border rounded-md p-4 space-y-3 hover:shadow-lg"
          >
            <div className="border rounded-md aspect-video grid items-center justify-center bg-muted">
              {image.type.startsWith("image/") ? (
                <Lucide.FileImage />
              ) : (
                <Lucide.File />
              )}
            </div>
            <div className="overflow-hidden text-center text-sm">
              {image.filename}
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
  const pctcomplete = 100*13/53;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 justify-center items-center">
        <Progress value={33} className="w-5/6" indicatorColor="bg-gray-600"/>
      </div>
      <CardDescription>
        Completed {ncompleted} of {ntotal} total tasks ({pctcomplete.toFixed(1)} %)
      </CardDescription>
    </div>
  )
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
          <li className="inline-block border-r px-2"><span className="font-bold">Id:       </span>{project.id}</li>
          <li className="inline-block border-r px-2"><span className="font-bold">Owner:    </span>{project.userid || "<unknown>"}</li>
          <li className="inline-block border-r px-2"><span className="font-bold">Country:  </span>{country || "<unknown>"}</li>
          <li className="inline-block border-r px-2"><span className="font-bold">Industry: </span>{buildingTypes[project.type].type || "<unknown>"}</li>
          <li className="inline-block border-r px-2"><span className="font-bold">Type:     </span>{project.subtype || "<unknown>"}</li>
          <li className="inline-block border-none px-2"><span className="font-bold">Created:  </span>{project.createdat.toDateString() || "<unknown>"}</li>
        </ul>
      </CardHeader>
    </Card>
  );
}

export default async function ProjectDescription({ project }: { project: any }) {

  return (
    <div className="flex flex-col gap-5">

      <ProjectInfoBar project={project} />

      <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-5">
        <Card>
          <CardHeader>Status</CardHeader>
          <CardContent>
            <CardDescription>
              Your project is in a list waiting to be picked up.
            </CardDescription>
            <CardDescription>
              Check back later for updates
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Updates</CardHeader>
          <CardContent>
            <CardDescription>
              Here you will see the latest updates to your project
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>Progress and Milestones</CardHeader>
        <CardContent>
          <Suspense fallback={<ProjectDesignViewsFallback />}>
            <ProjectProgressSummary project={project} />
          </Suspense>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Design Views</CardHeader>
        <CardContent>
          <Suspense fallback={<ProjectDesignViewsFallback />}>
            <ProjectDesignViews project={project} />
          </Suspense>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Description</CardHeader>
        <CardContent>
          <CardDescription className="whitespace-pre-line">
            {project.description}
          </CardDescription>
        </CardContent>
      </Card>

    </div>
  );
}


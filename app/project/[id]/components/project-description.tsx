import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { getProjectFiles } from "@/lib/actions";
import { Suspense, useMemo } from "react";
import * as Lucide from "lucide-react";
import { Progress } from "@/components/ui/progress";

function ProjectDesignViewsFallback() {
  return (<p>Loading images ...</p>);
}

async function ProjectDesignViews({ project }: { project: any }) {
  const imageUrlArray = await getProjectFiles(project.id);

  if (!imageUrlArray || imageUrlArray.length === 0) {
    return (<>
      <CardDescription>
        You have no uploaded floor plans or 3D models yet.
      </CardDescription>
      <CardDescription>
        As progress is made on your designs, they will be displayed here.
      </CardDescription>
    </>);
  }

  return (
    <Carousel className="mx-12 min-h-32">
      <CarouselContent>

        {/* TODO click image to view or download */}
        {/* TODO name and description for each file */}
        {/* TODO preview files other than image files */}
        {imageUrlArray.map((image, index) =>
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <Card className='flex flex-col items-center justify-center p-2'>
              <CardContent className="flex justify-center items-center aspect-square overflow-hidden">
                {
                  image.type.startsWith("image/") ? 
                  // <Image src={image.url!} alt={''} height={180} width={180} className="opacity-90 saturate-[.75]" /> :
                  <Lucide.FileImage className="h-24 w-24" /> :
                  <Lucide.File className="h-24 w-24" />
                }
              </CardContent>
              <CardHeader className='p-3 pb-0 overflow-hidden'>
                <CardDescription>
                  {image.filename}
                </CardDescription>
              </CardHeader>
            </Card>
          </CarouselItem>
        )}
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

export default async function ProjectDescription({ project }: { project: any }) {

  const displayNames = useMemo(() => {
    return new Intl.DisplayNames(["en"], { type: "region" });
  }, []);
  const country = displayNames.of(project.countrycode);

  return (
    <div className="flex flex-col gap-5">

      <Card>
        <CardHeader className="text-sm text-muted-foreground">
            <ul className="inline-block">
              <li className="inline-block border-r px-2"><span className="font-bold">Id:       </span>{project.id}</li>
              <li className="inline-block border-r px-2"><span className="font-bold">Owner:    </span>{project.userid || "<unknown>"}</li>
              <li className="inline-block border-r px-2"><span className="font-bold">Country:  </span>{country || "<unknown>"}</li>
              <li className="inline-block border-r px-2"><span className="font-bold">Industry: </span>{project.type || "<unknown>"}</li>
              <li className="inline-block border-r px-2"><span className="font-bold">Type:     </span>{project.subtype || "<unknown>"}</li>
              <li className="inline-block border-none px-2"><span className="font-bold">Created:  </span>{project.createdat.toDateString() || "<unknown>"}</li>
            </ul>
        </CardHeader>
      </Card>

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


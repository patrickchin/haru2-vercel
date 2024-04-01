import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { getProjectFiles } from "@/lib/actions";
import Image from "next/image";
import { Suspense, useMemo } from "react";
import * as Lucide from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "react-day-picker";

function ProjectDesignViewsFallback() {
  return (<p>Loading images ...</p>);
}

async function ProjectDesignViews({ projectId }: { projectId: number }) {
  const imageUrlArray = await getProjectFiles(projectId);

  if (!imageUrlArray || imageUrlArray.length === 0) {
    return (<CardDescription>
      <p>You have no uploaded floor plans or 3D models yet.</p>
      <p>As progress is made on your designs, they will be displayed here.</p>
    </CardDescription>);
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

export default async function ProjectDescription({ project }: { project: any }) {

  const displayNames = useMemo(() => {
    return new Intl.DisplayNames(["en"], { type: "region" });
  }, []);
  const country = displayNames.of(project.countrycode);

  return (
    <div className="flex flex-col gap-5">

      <Card>
        <CardHeader>
          <CardDescription>
            <ul className="inline-block">
              <li className="inline-block border-r px-2"><span className="font-bold">Id:       </span>{project.id}</li>
              <li className="inline-block border-r px-2"><span className="font-bold">Owner:    </span>{project.userid || "<unknown>"}</li>
              <li className="inline-block border-r px-2"><span className="font-bold">Country:  </span>{country || "<unknown>"}</li>
              <li className="inline-block border-r px-2"><span className="font-bold">Industry: </span>{project.type || "<unknown>"}</li>
              <li className="inline-block border-r px-2"><span className="font-bold">Type:     </span>{project.subtype || "<unknown>"}</li>
              <li className="inline-block border-none px-2"><span className="font-bold">Created:  </span>{project.createdat.toDateString() || "<unknown>"}</li>
            </ul>
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-5">
        <Card>
          <CardHeader>Status</CardHeader>
          <CardContent>
            <CardDescription>
              <p>Your project is in a list waiting to be picked up.</p>
              <p>Check back later for updates</p>
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
        <CardHeader>Design Views</CardHeader>
        <CardContent>
          <Suspense fallback={<ProjectDesignViewsFallback />}>
            <ProjectDesignViews projectId={project.id} />
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


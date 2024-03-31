import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { getProjectFiles } from "@/lib/actions";
import Image from "next/image";
import { Suspense } from "react";
import * as Lucide from "lucide-react";
import { Separator } from "@/components/ui/separator";

function ProjectDesignViewsFallback() {
  return (<p>Loading images ...</p>);
}

async function ProjectDesignViews({ projectId }: { projectId: number }) {
  const imageUrlArray = await getProjectFiles(projectId);

  if (!imageUrlArray || imageUrlArray.length === 0) {
    return (<p>You have no uploaded floor plans or 3d models yet</p>);
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
  return (
    <div className="flex flex-col gap-5">

      <Card>
        <CardHeader>Design Views</CardHeader>
        <CardContent>
          <Suspense fallback={<ProjectDesignViewsFallback />}>
            <ProjectDesignViews projectId={project.id} />
          </Suspense>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>Info</CardHeader>
        <CardContent>
          <ul>
            <li>Id:        <span className="font-normal">{project.id}</span></li>
            <li>Owner:     <span className="font-normal">{project.userId}</span></li>
            <li>Country:   <span className="font-normal">{project.extrainfo.country}</span></li>
            <li>Industry:  <span className="font-normal">{project.extrainfo.buildingType}</span></li>
            <li>Type:      <span className="font-normal">{project.extrainfo.buildingSubtype}</span></li>
            <li>Created:   <span className="font-normal">{project.extrainfo.createdat}</span></li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Description</CardHeader>
        <CardContent>
          {project.description}
        </CardContent>
      </Card>

    </div>
  );
}


import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { getProjectFiles } from "@/lib/actions";
import Image from "next/image";
import { Suspense } from "react";
import * as Lucide from "lucide-react";
import { Separator } from "@/components/ui/separator";

function ProjectDesignViewsFallbackContent() {
  return (<CarouselItem>
      <h4>Loading images ...</h4>
    </CarouselItem>);
}

async function ProjectDesignViewsContent({ projectId }: { projectId: number }) {
  const imageUrlArray = await getProjectFiles(projectId);
  console.log(imageUrlArray, projectId);
  return (
    <>
      {/* TODO click image to view or download */}
      {/* TODO name and description for each file */}
      {/* TODO preview files other than image files */}
      {imageUrlArray?.map((image, index) =>
        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
          <Card className='flex flex-col items-center justify-center p-2'>
            <CardContent className="flex justify-center items-center aspect-square overflow-hidden">
              {
                image.type.startsWith("image/") ? 
                <Image src={image.url!} alt={''} height={180} width={180} className="opacity-90 saturate-[.75]" /> :
                <Lucide.File />
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
      {imageUrlArray.length === 0 &&
        <CarouselItem>
          <h4>No views</h4>
        </CarouselItem>}
    </>
  );
}

function ProjectDesignViews({ projectId }: { projectId: number }) {
  return (
    <div className='flex flex-col space-y-4 bg-accent rounded-lg px-6 pt-4 pb-6'>
      <h4>Design Views</h4>
      <Carousel className="mx-12 min-h-32">
        <CarouselContent>
          <Suspense fallback={(<ProjectDesignViewsFallbackContent />)}>
            <ProjectDesignViewsContent projectId={projectId} />
          </Suspense>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default async function ProjectDescription({ project }: { project: any }) {
  return (
    <div className="flex flex-col gap-5">
      <ProjectDesignViews projectId={project.id} />

      <div className='flex flex-row'>

        <div className="flex-none w-56 p-5 font-bold bg-accent rounded-lg px-6 py-4">
          <ul>
            <li>Id:        <span className="font-normal">{project.id}</span></li>
            <li>Owner:     <span className="font-normal">{project.userid}</span></li>
            <li>Country:   <span className="font-normal">{project.country}</span></li>
            <li>Industry:  <span className="font-normal">{project.type}</span></li>
            <li>Type:      <span className="font-normal">{project.subtype}</span></li>
            <li>Created:   <span className="font-normal">{project.createdat.toString()}</span></li>
          </ul>
        </div>

        <Separator orientation="vertical" />

        <div className="overflow-hidden p-5">
          {project.description}
        </div>

      </div>

      <pre className="overflow-hidden">{JSON.stringify(project, null, 2)}</pre>
    </div>
  );
}


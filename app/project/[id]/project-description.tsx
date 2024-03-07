import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { getProjectFiles } from "@/lib/actions";
import { questions } from "content/questions";
import Image from "next/image";
import { Suspense } from "react";
import { Link } from "lucide-react";

function ProjectDesignViewsFallbackContent() {
  return (<CarouselItem>
      <h4>Loading images ...</h4>
    </CarouselItem>);
}

async function ProjectDesignViewsContent({ projectId }: { projectId: number }) {
  const imageUrlArray = await getProjectFiles(projectId, true);
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
              <Link href={image.url}></Link>
              <Image src={image.url!} alt={''} height={180} width={180} className="opacity-90 saturate-[.75]" />
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
    <div className="flex flex-col gap-y-4">
      <ProjectDesignViews projectId={project.id} />

      <div className='flex flex-col space-y-3'>

        <div>
          <h4>Location:</h4>
          <p>{project.info.country || "Unspecified location"}</p>
        </div>

        <div>
          <h4>Building Type:</h4>
          <p>{project.info.type || "Unspecified construction type"}</p>
        </div>

        {questions.map((qa, i) => (
          <div key={i}>
            <h4>{qa.title}</h4>
            <p>{project.info[qa.name] || `nothing specified`}</p>
          </div>
        ))}
      
        <div>
          <pre className="overflow-hidden">
            {JSON.stringify(project, null, 2)}
          </pre>
        </div>


      </div>
    </div>
  );
}


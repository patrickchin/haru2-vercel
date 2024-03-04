import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { getProjectFiles } from "@/lib/actions";
import { getProject } from "@/lib/db";
import { questions } from "content/questions";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

function ProjectDesignViews({ imageUrlArray }: { imageUrlArray: (string | null)[] | null }) {
  return (
    <div className='flex flex-col space-y-4 bg-accent rounded-lg px-6 py-4'>
      <h4>Design Views</h4>
      <Carousel className="mx-12">
        <CarouselContent>
          {/* TODO click image to view or download */}
          {/* TODO name and description for each file */}
          {/* TODO preview images other than image files */}
          {imageUrlArray && imageUrlArray.map((url, index) => url && (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Card className='flex flex-col items-center justify-center p-2 opacity-65 hover:opacity-100'>
                <CardContent>
                  <Image src={url} alt={''} height={180} width={180} />
                </CardContent>
                <CardHeader className='p-3 pb-0'>
                  <CardDescription>
                    Floor Plan
                  </CardDescription>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default async function ProjectDescription({ projectId, }: { projectId: number }) {
  const projectInfoArr = await getProject(projectId);
  if (projectInfoArr.length != 1) {
    if (projectInfoArr.length > 1)
      console.log(`Found ${projectInfoArr.length} projects with id ${projectId}`);
    redirect('/project/not-found');
  }

  const projectInfo: any = projectInfoArr[0].info;
  const imageUrlArray = await getProjectFiles(projectId, true);

  return (
    <div>
      <Suspense fallback={(<p>Loading Images ...</p>)}>
        <ProjectDesignViews imageUrlArray={imageUrlArray} />
      </Suspense>

      <div className='flex flex-col space-y-3'>
        <h2>
          {projectInfo.title || "Untitled"}
        </h2 >

        <div>
          <h4>Location:</h4>
          <p>{projectInfo.country || "Unspecified location"}</p>
        </div>

        <div>
          <h4>Building Type:</h4>
          <p>{projectInfo.type || "Unspecified construction type"}</p>
        </div>

        {questions.map((qa, i) => (
          <div key={i}>
            <h4>{qa.title}</h4>
            <p>{projectInfo[qa.name] || `nothing specified`}</p>
          </div>
        ))}
      
        <div>
          <pre className="overflow-hidden">
            {JSON.stringify(projectInfo, null, 2)}
          </pre>
        </div>


      </div>
    </div>
  );
}


import { redirect } from 'next/navigation';
import Image from "next/image"

import SimpleLayout from '@/components/layout';
import { getProject } from '@/lib/db';
import { Suspense } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import Example1 from '@/assets/example-floor-plan.png';
import Example2 from '@/assets/example-3d.png';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { questions } from 'content/questions';

async function ProjectDescription({ projectid }: { projectid: number }) {

  const projectInfoArr = await getProject(projectid);
  if (projectInfoArr.length != 1)
  {
    if (projectInfoArr.length > 1)
      console.log(`Found ${projectInfoArr.length} projects with id ${projectid}`);
    redirect('/project/not-found');
  }

  const projectInfo: any = projectInfoArr[0].info;

  // const imageArray = await getProjectImages(projectid);
  const imageArray = [ Example1, Example2, Example1, Example2, Example1 ];

  return (
    <>
      <Carousel>
        <CarouselContent>

          {imageArray.map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Card>
                <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                  <Image src={image} alt={''} height={300} width={300} />
                  <CardHeader className='p-3 pb-0'>
                    <CardDescription>Floor Plan</CardDescription>
                  </CardHeader>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="w-full flex items-center justify-center">
      </div> 
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {projectInfo.title || "Untitled"}
      </h2 >
      <p>
        Location: {projectInfo.country || "Unspecified location"}
      </p>
      <p>
        Type: {projectInfo.type || "Unspecified construction type"}
      </p>

      {questions.map((qa, i) => (
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {qa.title}
          </h4>
          <p>
            {projectInfo[qa.name] || `nothing specified`}
          </p>
        </div>
      ))}

      <div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Furure
        </h4>
        <p>
          {projectInfo.furure || `nothing specified`}
        </p>
      </div>

        {projectInfo.future}
        {projectInfo.budget}
        {projectInfo.energy}
        {projectInfo.technology}
        {projectInfo.outdoors}
        {projectInfo.security}
        {projectInfo.maintenance}
        {projectInfo.special}
      {Object.entries(projectInfo).map((desc, i) =>
        <div key={i}>
          <h4>{desc[0]}</h4>
          <p>{desc[1] as string}</p>
        </div>
      )}
    </>
  )
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {

  const projectid: number = parseInt(params.id);
  if (Number.isNaN(projectid))
    redirect('/project/not-found');

  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16 gap-12">
        <Suspense fallback={<p>Loading ...</p>}>
          <ProjectDescription projectid={projectid}/>
        </Suspense>
      </section>
    </SimpleLayout>
  )
}
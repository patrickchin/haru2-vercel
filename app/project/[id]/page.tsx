import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Image, { StaticImageData } from "next/image"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { getProject } from '@/lib/db';
import SimpleLayout from '@/components/layout';
import Example1 from '@/app/assets/example-floor-plan.png';
import Example2 from '@/app/assets/example-3d.png';
import { questions } from 'content/questions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MoveRight, SquareUserRound, User } from 'lucide-react';

function ProjectRequestStatus() {
  return (
    <div className='flex flex-col'>
      <p>TODO only show this after they click hire a design team</p>
      <div className='flex flex-row justify-between items-center'>

        <Card className='flex flex-col items-center'>
          <CardContent>
            <User className="h-32 w-32 pt-4" />
          </CardContent>
          <CardFooter>
            <CardDescription>Client</CardDescription>
          </CardFooter>
        </Card>

        <div className='flex flex-row grow-0'>
          <MoveRight className='h-20 w-20' />
        </div>
        <div className='flex flex-row space-x-2'>
          <Link href='/portfolio'>
            <Card className='flex flex-col items-center hover:bg-accent'>
              <CardContent>
                <SquareUserRound className="h-32 w-32 pt-4" />
              </CardContent>
              <CardFooter className='flex-col'>
                <h4>Designer 1</h4>
                <p>Pending</p>
              </CardFooter>
            </Card>
          </Link>

          <Link href='/portfolio'>
            <Card className='flex flex-col items-center hover:bg-accent'>
              <CardContent>
                <SquareUserRound className="h-32 w-32 pt-4" />
              </CardContent>
              <CardFooter className='flex-col'>
                <h4>Designer 2</h4>
                <p>Pending</p>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </div>

      <div>
        <p>schedule an interview</p>
        <p>task management button</p>
      </div>
    </div>
  );
}

function ProjectDesignViews({ imageArray }:{ imageArray: StaticImageData[] }) {
  return (
    <div className='flex flex-col space-y-4'>
      <h4>Design Views</h4>
      <Carousel>
        <CarouselContent>
          {imageArray.map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Card className='flex flex-col aspect-square items-center justify-center p-2 hover:bg-accent'>
                <CardContent>
                  <Image src={image} alt={''} height={300} width={300} />
                </CardContent>
                <CardHeader className='p-3 pb-0'>
                  <CardDescription>Floor Plan</CardDescription>
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

function ProjectDescription({ projectInfo }: { projectInfo: any }) {
  return (
    <>
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
      </div>
    </>
  )
}

async function ProjectPage({ projectId, }: { projectId: number }) {

  const projectInfoArr = await getProject(projectId);
  if (projectInfoArr.length != 1) {
    if (projectInfoArr.length > 1)
      console.log(`Found ${projectInfoArr.length} projects with id ${projectId}`);
    redirect('/project/not-found');
  }

  const projectInfo: any = projectInfoArr[0].info;
  // const imageArray = await getProjectImages(projectid);
  const imageArray: StaticImageData[] = [Example1, Example2, Example1, Example2, Example1];

  return (
    <>
      <ProjectRequestStatus />

      <ProjectDesignViews imageArray={imageArray} />

      <ProjectDescription projectInfo={projectInfo} />

      <div className="mt-6 flex items-center justify-end gap-x-3">
        <Button asChild type="button">
          <Link href="#">
            Hire a Design Team
          </Link>
        </Button>
      </div>
    </>
  );
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {

  const projectid: number = parseInt(params.id);
  if (Number.isNaN(projectid)) {
    redirect('/project/not-found');
  }

  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16 gap-12">
        <Suspense fallback={<p>Loading ...</p>}>
          <ProjectPage projectId={projectid}/>
        </Suspense>
      </section>
    </SimpleLayout>
  )
}
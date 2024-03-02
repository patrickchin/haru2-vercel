import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MoveRight, SquareUserRound, User } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter} from '@/components/ui/card';
import SimpleLayout from '@/components/layout';

function ProjectRequestStatus() {
  return (
    <div className='flex flex-col'>
      <p>TODO only show this after they click hire a design team</p>
      <p>TODO have some actual project status in the db</p>
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

export default async function Page({ params, }:{ params: { id: string } }) {

  const projectid: number = parseInt(params.id);
  if (Number.isNaN(projectid)) {
    redirect('/project/not-found');
  }

  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16 gap-12">
        <Suspense fallback={<p>Loading ...</p>}>
          <ProjectRequestStatus />
        </Suspense>
      </section>
    </SimpleLayout>
  )
}
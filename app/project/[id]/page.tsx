import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import SimpleLayout from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectDescription from './project-description';
import ProjectAcceptance from './project-acceptance';
import ProjectProgress from './project-progress';


export default async function Page({ params, }:{ params: { id: string } }) {

  const projectId: number = parseInt(params.id);
  if (Number.isNaN(projectId)) {
    redirect('/project/not-found');
  }

  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16 gap-12">

        <h1>Project Page</h1>

        <Tabs defaultValue="description" className="w-full space-y-8">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="acceptance">Acceptance Status</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          <TabsContent value="description">
            <Suspense fallback={<p>Loading ...</p>}>
              <ProjectDescription projectId={projectId} />
            </Suspense>
          </TabsContent>
          <TabsContent value="acceptance">
            <Suspense fallback={<p>Loading ...</p>}>
              <ProjectAcceptance projectId={projectId} />
            </Suspense>
          </TabsContent>
          <TabsContent value="progress">
            <Suspense fallback={<p>Loading ...</p>}>
              <ProjectProgress projectId={projectId} />
            </Suspense>
          </TabsContent>
        </Tabs>


      </section>
    </SimpleLayout>
  )
}
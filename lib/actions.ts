'use server';

import { redirect } from 'next/navigation'
import { createProject } from '@/lib/db';
import { auth } from './auth';

export async function submitProjectPost(formData: FormData) {

  const session = await auth();
  if (!session?.user)
    console.log("Can't submit a post without being logged in.");

  const rawFormData = {

    title: formData.get('title'),
    type: formData.get('type'),
    country: formData.get('country'),

    lifestyle: formData.get('lifestyle'),
    future: formData.get('future'),
    budget: formData.get('budget'),
    energy: formData.get('energy'),
    technology: formData.get('technology'),
    outdoors: formData.get('outdoors'),
    security: formData.get('security'),
    maintenance: formData.get('maintenance'),
    special: formData.get('special'),
  };

  if (session?.user?.id)
    await createProject(Number(session.user.id), rawFormData);

  redirect("/projects");
}
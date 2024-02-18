'use server';

import { redirect } from 'next/navigation'
import { createJob } from '@/app/db';
import { auth } from './auth';

export async function submitJobPost(formData: FormData) {

  const session = await auth();

  const rawFormData = {

    type: formData.get('type'),
    subtype: formData.get('subtype'),

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

  // session.id instead of 2
  await createJob(2, rawFormData);

  redirect("/jobs");
}
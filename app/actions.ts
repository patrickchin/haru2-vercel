'use server';

import { createJob } from '@/app/db';

export async function submitJobPost(formData: FormData) {

  const rawFormData = {
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

  createJob(2, rawFormData);
}
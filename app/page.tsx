import Link from 'next/link';
import { SimpleLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';

export default function Page() {
  return (
    <SimpleLayout>
      <div className="grow flex flex-col space-y-12 w-screen mx-auto max-w-4xl px-12 pt-52">
        <h1 className='text-6xl'>Streamlined Construction Management</h1>
        <p className='font-bold text-lg'>
          {"Tell us about your project and let's"}
          <Button asChild className='w-fit ml-2 font-bold text-base'>
            <Link href="/new-project">
              get started
            </Link>
          </Button>
        </p>
      </div>
    </SimpleLayout>
  );
}

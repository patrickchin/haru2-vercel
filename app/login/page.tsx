import Link from 'next/link';
import { signIn } from '@/lib/auth';

import { SimpleLayout } from '@/components/layout';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Login() {

  const signInAction = async (formData: FormData) => {
    'use server';
    await signIn('credentials', {
      redirectTo: '/',
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
  };

  return (
    <SimpleLayout>
      <div className="w-screen max-w-md rounded-2xl shadow-xl overflow-hidden">

        <div className="flex flex-col py-6 space-y-3 bg-background text-center border-b border-border">
          <h3>Login</h3>
          <p>Use your email and password to login</p>
        </div>

        <form action={signInAction} className="flex flex-col gap-y-4 bg-gray-50 px-16 py-6">

          <div>
            <Label htmlFor="email" className="text-xs uppercase">
              Email Address
            </Label>
            <Input name="email" type="email" placeholder="user@acme.com"
              autoComplete="email" required className="text-sm" />
          </div>

          <div>
            <Label htmlFor="password" className="text-xs uppercase">
              Password
            </Label>
            <Input name="password" type="password" required className="text-sm" />
          </div>

          <Button className="text-sm">Login</Button>

          <p className="text-center text-sm text-gray-600">
            {" Don't have an account? "}
            <Link href="/register" className="font-bold hover:underline">
              {"Sign up"}
            </Link>
            {" for free."}
          </p>

        </form>
      </div>
    </SimpleLayout>
  );
}

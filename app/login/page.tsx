'use client';

import Link from 'next/link';
// must go through actions.ts file, instead of auth.ts
import { signInFromLogin } from '@/lib/actions';

import { SimpleLayout } from '@/components/page-layouts';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Login() {

  const schema = z.object({
    email: z.string().trim().min(1, {message: "Email is required"}).email(),
    password: z.string().min(8, {message: "Password must contain at least 8 characters"}),
  })

  type FormFields = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {

    try {
      await signInFromLogin({
        redirectTo: '/',
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <SimpleLayout>
      <div className="w-screen max-w-md rounded-2xl shadow-xl overflow-hidden">

        <div className="flex flex-col py-6 space-y-3 bg-background text-center border-b border-border">
          <h3>Login</h3>
          <p>Use your email and password to login</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 bg-gray-50 px-16 py-6">

          <div>
            <Label htmlFor="email" className="text-xs uppercase">
              Email Address
              <Input {...register("email")} type="email" placeholder="user@acme.com"
              autoComplete="email" required className="text-sm" />
            </Label>
            {errors.email && (
              <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-xs uppercase">
              Password
              <Input {...register("password")} type="password" required className="text-sm" />
            </Label>
            {errors.password && (
              <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button className="text-sm" type="submit">Login</Button>

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

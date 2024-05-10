'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { registerUser } from '@/lib/actions';
import { SimpleLayout } from '@/components/page-layouts';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, RegisterSchemaType } from '@/lib/types';

export default function Page() {

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit: SubmitHandler<RegisterSchemaType> = async (data) => {
    try {
      await registerUser(data);
      redirect('/login');
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <SimpleLayout>
      <div className="w-screen max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col py-6 space-y-3 bg-background text-center border-b border-border">
            <h3>Create an Account</h3>
            <p>Create an account with your email and password</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 bg-gray-50 px-16 py-6">

          <div>
            <Label htmlFor="name" className="text-xs uppercase">
              Name <span className="font-bold text-red-400">*</span>
              <Input {...register("name")} required className="text-sm" type="text" placeholder="" />
            </Label>
            {errors.name && (
              <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-xs uppercase">
              Phone Number
              <Input {...register("phone")} className="text-sm"
              type="tel" placeholder="+254" />
            </Label>
            {errors.phone && (
              <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-xs uppercase">
              Email Address <span className="font-bold text-red-400">*</span>
              <Input {...register("email")} type="email" placeholder="user@acme.com"
              autoComplete="email" required className="text-sm" />
            </Label>
            {errors.email && (
              <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-xs uppercase">
              Password <span className="font-bold text-red-400">*</span>
              <Input {...register("password")} type="password" required className="text-sm" />
            </Label>
            {errors.password && (
              <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Label className="text-xs uppercase">
              Confirm Password <span className="font-bold text-red-400">*</span>
              <Input {...register("confirmPassword")} type="password" required className="text-sm" />
            </Label>
            {errors.confirmPassword && (
              <p className="text-sm font-medium text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button className="text-sm mt-2" type="submit">Sign Up</Button>

          <p className="text-center text-sm text-gray-600">
            {"Already have an account? "}
            <Link href="/login" className="font-bold hover:underline">
              {"Login"}
            </Link>
            {" instead."}
          </p>
        </form>
      </div>
    </SimpleLayout>
  );
}

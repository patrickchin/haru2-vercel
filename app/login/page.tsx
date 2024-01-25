import Link from 'next/link';
import { signIn } from 'app/auth';

import LoginForm from '@/app/components/login-form';
import SubmitButton  from '@/app/components/submit-button';
import SimpleLayout from '@/app/components/layout';

export default function Login() {
  
  const signInAction = async (formData: FormData) => {
    'use server';
    await signIn('credentials', {
      redirectTo: '/dashboard',
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
  };

  return (
    <SimpleLayout>
        <div className="w-screen max-w-md rounded-2xl border border-gray-100 shadow-xl overflow-hidden self-center">

          <div className="flex flex-col h-fit items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
            <h3 className="text-xl font-semibold">Login</h3>
            <p className="text-sm text-gray-500">
              Use your email and password to login
            </p>
          </div>

          <LoginForm action={signInAction}>
            <SubmitButton>Login</SubmitButton>
            <p className="text-center text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/register" className="font-semibold text-gray-800">
                Sign up
              </Link>
              {" for free."}
            </p>
          </LoginForm>

        </div>
    </SimpleLayout>
  );
}

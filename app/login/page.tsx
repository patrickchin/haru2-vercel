import Link from 'next/link';
import { Form } from 'app/form';
import { signIn } from 'app/auth';
import { SubmitButton } from 'app/components/submit-button';
import Header from 'app/components/header';

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
    <div className="flex flex-col h-screen w-screen bg-gray-50">
      <Header />
      <main className='grow w-screen flex flex-col justify-center items-center'>
        <div className="z-10 w-screen max-w-md rounded-2xl border border-gray-100 shadow-xl overflow-hidden">

          <div className="flex flex-col h-fit items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
            <h3 className="text-xl font-semibold">Login</h3>
            <p className="text-sm text-gray-500">
              Use your email and password to login
            </p>
          </div>

          <Form action={signInAction}>
            <SubmitButton>Login</SubmitButton>
            <p className="text-center text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/register" className="font-semibold text-gray-800">
                Sign up
              </Link>
              {' for free.'}
            </p>
          </Form>
        </div>
      </main>
    </div>
  );
}

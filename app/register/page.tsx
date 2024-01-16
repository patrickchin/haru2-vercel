import Link from 'next/link';
import { Form } from 'app/form';
import { redirect } from 'next/navigation';
import { createUser, getUser } from 'app/db';
import { SubmitButton } from 'app/submit-button';
import Header from '../components/header';

export default function Login() {
  async function register(formData: FormData) {
    'use server';
    let email = formData.get('email') as string;
    let password = formData.get('password') as string;
    let user = await getUser(email);

    if (user.length > 0) {
      return 'User already exists'; // TODO: Handle errors with useFormStatus
    } else {
      await createUser(email, password);
      redirect('/login');
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col items-start justify-start bg-gray-50">
      <Header/>
      <main className="h-full w-[32rem] min-w-[60%] flex justify-end items-center overflow-hidden border border-gray-100 shadow-xl">
        <div className="h-min w-[32rem] bg-blue">

          <div className="flex flex-col items-center justify-center space-y-3 border border-r-0 border-gray-200 rounded-tl-2xl bg-white px-4 py-6 pt-8 text-center sm:px-16">
            <h3 className="text-xl font-semibold">Create an Account</h3>
            <p className="text-sm text-gray-500">
              Create an account with your email and password
            </p>
          </div>
          <Form action={register} extraStyle="border border-r-0 border-gray-200 rounded-bl-2xl">
            <SubmitButton>Sign Up</SubmitButton>
            <p className="text-center text-sm text-gray-600">
              {'Already have an account? '}
              <Link href="/login" className="font-semibold text-gray-800">
                Login
              </Link>
              {' instead.'}
            </p>
          </Form>
        </div>
      </main>
      <footer></footer>
    </div>
  );
}

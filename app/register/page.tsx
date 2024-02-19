import Link from 'next/link';
import LoginForm from '@/app/components/login-form';
import { redirect } from 'next/navigation';
import { createUser, getUser } from '@/lib/db';
import  SubmitButton  from '@/app/components/submit-button';
import SimpleLayout from '@/app/components/layout';

export default function Page() {

  async function register(formData: FormData) {
    'use server';
    let email = formData.get('email') as string;
    let password = formData.get('password') as string;
    let confirmPassword = formData.get('confirm-password') as string;
    
    // TODO do this locally??
    if (confirmPassword !== password)
      return 'Passwords do not match';

    let user = await getUser(email);

    if (user.length > 0) {
      return 'User already exists'; // TODO: Handle errors with useFormStatus
    } else {
      await createUser(email, password);
      redirect('/login');
    }
  }

  return (
    <SimpleLayout>
      <div className="grow flex justify-center items-center">
        <div className="z-10 w-screen max-w-md rounded-2xl border border-gray-100 shadow-xl overflow-hidden">

          <div className="flex flex-col h-fit items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
            <h3 className="text-xl font-semibold">Create an Account</h3>
            <p className="text-sm text-gray-500">
              Create an account with your email and password
            </p>
          </div>

          <LoginForm action={register} confirmPassword={true}>
            <SubmitButton>Sign Up</SubmitButton>
            <p className="text-center text-sm text-gray-600">
              {"Already have an account? "}
              <Link href="/login" className="font-semibold text-gray-800">
                Login
              </Link>
              {" instead."}
            </p>
          </LoginForm>

        </div>
      </div>
    </SimpleLayout>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { createUser, getUser } from "@/lib/db";
import { SimpleLayout } from "@/components/page-layouts";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Page() {
  const colors = ["#FF5733", "#34A853", "#4285F4", "#FBBC05", "#EA4335"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  async function register(formData: FormData) {
    "use server";
    let name = formData.get("name") as string;
    let phone = formData.get("phone") as string;
    let email = formData.get("email") as string;
    let password = formData.get("password") as string;
    let confirmPassword = formData.get("confirm-password") as string;

    // TODO do confirm password checking locally with react-hook-forms
    if (confirmPassword !== password) {
      return "Passwords do not match";
    }

    let user = await getUser(email);

    if (user.length > 0) {
      // TODO: Handle errors with useFormStatus
      return "User already exists";
    } else {
      await createUser(name, phone, email, password, randomColor);
      redirect("/login");
    }
  }

  return (
    <SimpleLayout>
      <div className="w-screen max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col py-6 space-y-3 bg-background text-center border-b border-border">
          <h3>Create an Account</h3>
          <p>Create an account with your email and password</p>
        </div>

        <form
          action={register}
          className="flex flex-col gap-y-4 bg-gray-50 px-16 py-6"
        >
          <div>
            <Label htmlFor="name" className="text-xs uppercase">
              Name <span className="font-bold text-red-400">*</span>
            </Label>
            <Input name="name" required className="text-sm" placeholder="" />
          </div>

          <div>
            <Label htmlFor="phone" className="text-xs uppercase">
              Phone Number
            </Label>
            <Input
              name="phone"
              className="text-sm"
              type="tel"
              placeholder="+254"
              minLength={5}
              maxLength={32}
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-xs uppercase">
              Email Address <span className="font-bold text-red-400">*</span>
            </Label>
            <Input
              name="email"
              type="email"
              placeholder="user@acme.com"
              autoComplete="email"
              required
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-xs uppercase">
              Password <span className="font-bold text-red-400">*</span>
            </Label>
            <Input
              name="password"
              type="password"
              required
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-xs uppercase">
              Confirm Password <span className="font-bold text-red-400">*</span>
            </Label>
            <Input
              name="confirm-password"
              type="password"
              required
              className="text-sm"
            />
          </div>

          <Button className="text-sm mt-2">Sign Up</Button>

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

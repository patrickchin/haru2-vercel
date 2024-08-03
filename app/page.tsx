import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow flex flex-col justify-center items-center relative">
        <div className="grid grid-cols-2 absolute h-full w-full -z-10">
          <div className="h-full bg-gradient-to-br from-cyan-100 to-indigo-200 hover:bg-none"></div>
          <div className="h-full bg-gradient-to-br from-pink-100 to-indigo-200"></div>
        </div>

        <div className="flex flex-col gap-16 max-w-7xl">
          <h1 className="flex text-center text-6xl">
            Streamlined Construction Management
          </h1>

          <div className="grid grid-cols-2 items-center mb-48">
            <div className="flex flex-col gap-4 items-end px-16">
              <h2 className="font-bold whitespace-nowrap">Design Management</h2>
              <p className="font-bold text-lg text-end">
                <span className="whitespace-nowrap pr-2">
                  Tell us about your project and let's
                </span>
                <Button asChild className="w-fit font-bold text-base">
                  <Link href="/new-project">
                    get started <ArrowRightIcon className="ml-2" />
                  </Link>
                </Button>
              </p>
            </div>

            <div className="flex flex-col gap-4 px-16">
              <h2 className="font-bold whitespace-nowrap">Site Supervision</h2>
              <p className="font-bold text-lg">
                <span className="whitespace-nowrap pr-2">
                  Hire our site analysis professionals
                </span>
                <Button asChild className="w-fit font-bold text-base">
                  <Link href="#">
                    get started <ArrowRightIcon className="ml-2" />
                  </Link>
                </Button>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

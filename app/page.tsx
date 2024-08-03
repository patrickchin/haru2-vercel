import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";

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
          <h1 className="flex justify-center items-center text-6xl">
            Streamlined Construction Management
          </h1>

          <div className="grid grid-cols-2 items-center mb-48 gap-32">
            <div className="flex flex-col gap-4 items-end">
              <h2 className="font-bold">Design Management</h2>
              <p className="font-bold text-lg">
                {"Tell us about your project and let's"}
                <Button asChild className="w-fit ml-2 font-bold text-base">
                  <Link href="/new-project">
                    get started <ArrowRightIcon className="ml-2" />
                  </Link>
                </Button>
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="font-bold">Site Supervision</h2>
              <p className="font-bold text-lg">
                {"Hire our site analysis professionals"}
                <Button asChild className="w-fit ml-2 font-bold text-base">
                  <Link href="#">
                    get started <ArrowRightIcon className="ml-2" />
                  </Link>
                </Button>
              </p>
            </div>
          </div>
        </div>
        {/*
         */}

        {/* <div className="grow flex flex-col space-y-12 w-screen mx-auto max-w-4xl px-12 pt-52">
        </div> */}
      </main>
      <Footer />
    </div>
  );
}

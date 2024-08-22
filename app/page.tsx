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
        <div className="grid grid-cols-1 absolute h-full w-full -z-10">
          {/* <div className="h-full bg-gradient-to-br from-cyan-100 to-indigo-200 hover:bg-none"></div> */}
          <div className="h-full bg-gradient-to-br from-pink-100 to-indigo-200"></div>
        </div>

        <div className="flex flex-col gap-16 max-w-7xl">
          <h1 className="flex text-center text-6xl">
            Your Construction Projects, Seamlessly Supervised
          </h1>

          <p className="text-center font-bold">
            <span className="whitespace-nowrap pr-2">
              Hire our Site Analysis Professionals
            </span>
            <Button asChild className="w-fit font-bold text-base">
              <Link href="/sites">
                Get Started <ArrowRightIcon className="ml-2" />
              </Link>
            </Button>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

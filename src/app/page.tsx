import Link from "next/link";
import Image from "next/image";
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
          {/* <div className="h-full bg-[url('/bg.jpg')] bg-"></div> */}
          <Image
            src="/bg.jpg"
            alt="background"
            fill={true}
            className="object-cover object-left-top"
          />
        </div>

        <div className="flex flex-col gap-16 max-w-7xl lg:mb-64 lg:ml-80 justify-end transition-all">
          <h1 className="flex text-right text-6xl whitespace-nowrap font-extrabold p-10 bg-slate-100/60 rounded">
            Your Construction Projects, <br />
            Seamlessly Supervised
          </h1>

          <div className="flex justify-end">
            <p className="text-right font-bold p-10 bg-slate-100/60 rounded">
              <span className="whitespace-nowrap pr-2">
                Hire our Site Analysis Professionals
              </span>
              <Button asChild className="w-fit font-bold text-base">
                <Link href="/new-site">
                  Get Started <ArrowRightIcon className="ml-2" />
                </Link>
              </Button>
            </p>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LucideMoveRight } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";
import bgimg from "./bg.jpg";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow flex flex-col justify-center items-center relative overflow-auto">
        <div className="grid grid-cols-1 absolute h-full w-full -z-10 overflow-hidden">
          <Image
            src={bgimg}
            alt="background"
            placeholder="blur"
            fill={true}
            className="object-cover object-center"
          />
        </div>

        <div className="flex flex-col gap-8 max-w-[86rem] w-full justify-end transition-all">
          <div className="justify-end flex -mt-32">
            <div
              className={cn(
                "flex flex-col gap-5 justify-end lg:text-right p-8 rounded",
                "bg-background/50 backdrop-blur-md",
              )}
            >
              <h1 className="text-4xl lg:text-4xl font-extrabold">
                Supervise Your Construction Projects
              </h1>
              <h2 className="text-xl font-extrabold">
                Online Site Monitoring and Management Services
              </h2>
            </div>
          </div>

          <div className="justify-end flex">
            <div
              className={cn(
                "flex flex-col gap-5 justify-end lg:text-right p-8 rounded",
                "bg-background/50 backdrop-blur-md",
              )}
            >
              <p className="font-extrabold">
                <span className="pr-2 text-xl">
                  Setup your own team or Hire our experts
                </span>
                <Button
                  asChild
                  className="w-fit font-bold text-base [&_svg]:size-8"
                >
                  <Link href="/sites">
                    Get Started
                    <LucideMoveRight className="ml-1" />
                  </Link>
                </Button>
              </p>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

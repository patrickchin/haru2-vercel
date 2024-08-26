import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, PhoneCallIcon } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import services from "@/content/services";
import Tag from "@/components/tag";
export default function Page() {
  return (
    <div className="flex flex-col">
      <Header />
      <section className="flex flex-col min-h-[calc(100vh-4rem)] justify-center items-center">
        <div className="flex flex-col max-w-4xl">
          <h1 className="text-center text-6xl mb-6">
            Your Construction Projects, <br />
            Seamlessly Supervised
          </h1>
          <p className="text-xl text-slate-500  text-center mb-16 mx-4">
            Trust us to manage and supervise your construction projects in
            Africa, ensuring every milestone is met with the quality you expect.
          </p>
          <div className="flex flex-row justify-center gap-4">
            <Button
              asChild
              className="w-fit font-medium text-base bg-slate-200 text-black hover:bg-slate-200"
            >
              <Link href="/sites">
                Schedule a Call <PhoneCallIcon className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="w-fit font-bold text-base bg-gradient-to-br from-cyan-600 to-indigo-600"
            >
              <Link href="/sites">
                Get Started <ArrowRightIcon className="ml-2 size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="flex flex-col min-h-screen bg-slate-100 items-center">
        <div className="flex flex-col max-w-7xl items-center max-w-4xl">
          <h2 className="text-center text-5xl mt-16 mb-3">
            Our Services Include
          </h2>
          <p className="text-center text-xl text-slate-500">
            Whether personal or commercial, we oversee your construction
            projects in Africa, delivering excellence and peace of mind wherever
            you are.
          </p>
          <div className="flex flex-wrap justify-center my-8">
            {services.map((item) => (
              <Tag
                key={item.name}
                title={item.name}
                body={item.description[0]}
              />
            ))}
          </div>

          <img
            src="/imgs/scr1.png"
            alt=""
            className="shadow-sm mt-4 mx-5 w-fit mx-6 md:w-3/4 lg:w-3/4"
          />
        </div>
      </section>
      <section className="flex flex-col h-52 items-center justify-center">
        {/* <div className="flex flex-row max-w-7xl items-left justify-center">
          <p className="text-left text-2xl text-slate-500 max-w-2xl mb-8 mr-12">
            Whether personal or commercial, we oversee your construction
            projects in Africa, delivering excellence and peace of mind wherever
            you are.
          </p>
          <Button
            asChild
            className="w-fit font-bold text-base bg-gradient-to-br from-cyan-600 to-indigo-600"
          >
            <Link href="/sites">
              Create an Account Now! <ArrowRightIcon className="ml-2 size-5" />
            </Link>
          </Button>
        </div> */}
        <p className="text-center font-bold">
          <span className="whitespace-nowrap mr-3">
            Hire our Site Analysis Professionals
          </span>
          <Button
            asChild
            className="w-fit font-bold text-base bg-gradient-to-br from-cyan-600 to-indigo-600"
          >
            <Link href="/sites">
              Get Started Now! <ArrowRightIcon className="ml-2 size-5" />
            </Link>
          </Button>
        </p>
      </section>
      <Footer />
    </div>
  );
}

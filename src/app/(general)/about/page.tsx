import { DefaultLayout } from "@/components/page-layouts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

import ImageHaruna from "./images/haruna.jpg";
import ImagePatrick from "./images/patrick.jpg";
import ImageSky from "./images/sky.jpg";
import ImageBenefit1 from "./images/benefit-1.png";
import ImageBenefit2 from "./images/benefit-2.png";
import ImageSupport from "./images/support-size.jpg";
import ImageSupervisor from "./images/site-supervisor.jpg";
import ImageOnline from "./images/online-platform.webp";

function Description() {
  return (
    <div className="flex flex-col items-start max-w-6xl mx-auto text-pretty py-10 min-h-[60svh]">
      <h1
        className={cn(
          "text-4xl font-extrabold mb-20 p-8 rounded-lg",
          "bg-background/30 backdrop-blur-md",
        )}
      >
        About Us
      </h1>
      <div
        className={cn(
          "flex flex-col gap-4 text-pretty text-lg p-8 rounded-lg ",
          "bg-background/50 backdrop-blur-md",
        )}
      >
        <p>
          We are a start-up company that specializes in digital platforms for
          building construction. We focus on simplifying collaboration in
          building design and construction management. We aim to close the gaps
          between design, material procurement, and construction.
        </p>

        <p>
          Site supervision is the first of many online services we plan to
          launch.
        </p>

        <p>
          We are introducing new technologies in residential, commercial, and
          industrial projects with a reputation for delivering quality and
          innovative solutions.
        </p>
      </div>
    </div>
  );
}

function Team() {
  const members = [
    {
      avatar: ImageHaruna,
      name: "Haruna Bayoh",
      description: `
        A researcher at Zhejiang University, earned his bachelor's degree in
        Civil Engineering from Fourah Bay College, University of Sierra Leone.
        He went on to pursue a Master's degree in Structural Engineering at
        Chang'An University, China. Worked as a building design engineer at
        Cheng Xian Prefabricated Building Company in Qingzhou, Shandong, where
        he made contributions in innovative building designs, focused on
        optimization and flexibility in the use of fabricated structural
        components for modular buildings.
    `,
    },
    {
      avatar: ImagePatrick,
      name: "Patrick Chin",
      description: `
        A senior software engineer with nearing a decade of industry experience
        in developing large-scale, real-time software systems. He holds a
        Master's degree in Physics from University College London and his
        software expertise spans both front-end and back-end development, which
        includes research and integration of algorithms, platform development,
        and integration of machine learning models.
      `,
    },
  ];

  return (
    <div className="flex flex-col items-center gap-12 mx-auto text-pretty py-10">
      <h2 className="text-4xl text-center font-bold">Meet the Team</h2>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 max-w-xl lg:max-w-5xl">
        {members.map((mem, i) => (
          <Card
            key={i}
            className="flex flex-col gap-4 items-center justify-start p-12"
          >
            <Avatar className="h-40 w-40">
              <AvatarImage asChild src="/1x1.png">
                <Image src={mem.avatar} alt={mem.name} />
              </AvatarImage>
              <AvatarFallback>{mem.name}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-8 items-center justify-center">
              <h3 className="font-semibold text-lg">{mem.name}</h3>
              <p className="text-muted-foreground text-justify leading-7">
                {mem.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Services() {
  return (
    <div className="flex flex-col items-center gap-12 max-w-6xl mx-auto text-pretty py-10">
      <h2 className="flex text-4xl font-bold justify-center">
        Service We Provide
      </h2>

      <div className="flex flex-col max-w-lg lg:max-w-none lg:grid lg:grid-cols-3 gap-6">
        <div className="flex flex-col gap-6">
          <div className="aspect-video rounded-lg overflow-hidden relative">
            <Image
              src={ImageOnline}
              alt="online platform"
              fill={true}
              className="object-cover"
            />
          </div>
          <p className="text-center px-1">
            We offer an online platform to help you manage and monitor your
            residential, commercial, and industrial construction projects.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="aspect-video rounded-lg overflow-hidden relative">
            <Image
              src={ImageSupervisor}
              alt="online platform"
              fill={true}
              className="object-cover"
            />
          </div>
          <p className="text-center px-1">
            Right now, we provide expert site supervisors in Sierra Leone and
            Kenya. If you&apos;re in another country, you can set up your own
            site supervision team using our platform to oversee your project.
          </p>
          <p className="text-center px-1">
            We plan to expand our expert supervisor services to more countries
            soon.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="aspect-video rounded-lg overflow-hidden relative">
            <Image
              src={ImageSupport}
              alt="support"
              fill={true}
              className="object-cover"
            />
          </div>
          <p className="text-center px-1">
            Our platform supports construction projects of all sizes.
          </p>
        </div>
      </div>
    </div>
  );
}

function Benefits() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto text-pretty py-10">
      <h2 className="text-4xl font-bold">The Benefits of using Harpa Pro</h2>

      <div className="flex flex-row gap-3">
        <div className="overflow-hidden relative w-80 -ml-24">
          <Image
            src={ImageBenefit1}
            alt="online platform"
            fill={true}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col gap-4 font-medium">
          <p>
            Log in from anywhere in the world to monitor your construction site.
          </p>
          <p>
            Keep track of building materials, equipment, and machinery usage.
          </p>
          <p>
            Use built-in Zoom meetings and chat messaging for easy communication
            with your architect, engineer, contractor, and site supervisor.
          </p>
          <p>
            Create your team, schedule site visits, and get weekly site reports.
          </p>
          <p>
            Stay updated on construction progress, material quality checks, and
            workmanship inspections.
          </p>
          <p>
            Access all your stored site reports anytime in case of legal
            disputes or for reference.
          </p>

          <Image
            src={ImageBenefit2}
            alt="benefit 2"
            width={360}
            height={360}
            className="absolute -bottom-12 right-0 opacity-30"
          />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DefaultLayout className="max-w-none p-0 gap-0 [&_section]:py-16">
      <section className="relative overflow-hidden">
        <Image
          src={ImageSky}
          alt="sky background"
          fill={true}
          className="absolute object-cover object-top opacity-80"
        />
        <Description />
      </section>

      <Separator />

      <section>
        <Team />
      </section>

      <Separator />

      <section>
        <Services />
      </section>

      <Separator />

      <section className="bg-yellow-400/65 relative overflow-hidden">
        <Benefits />
      </section>
    </DefaultLayout>
  );
}

import { DefaultLayout } from "@/components/page-layouts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HaruUserAvatar } from "@/components/user-avatar";
import { cn, getAvatarInitials } from "@/lib/utils";

export default function Page() {
  const divcn = "flex flex-col gap-8 max-w-6xl mx-auto text-pretty py-10";
  return (
    <DefaultLayout className="max-w-none p-0 gap-0 [&_section]:py-16">
      <section>
        <div className={cn(divcn)}>
          <h1 className="text-4xl font-bold">Harpa Pro</h1>
          <div className="flex flex-col gap-4">
            <p>
              Our company specializes in digital platforms for building
              construction. We focus on simplifying collaboration in building
              design and construction management. We aim to close the gaps
              between design, material procurement, and construction.
            </p>
            <p>
              The Site Supervision App is the first of many online tools we plan
              to launch.
            </p>
            <p>At the moment, we only offer site supervision services.</p>
          </div>
        </div>
      </section>

      <section>
        <div className={cn(divcn)}>
          <h2 className="text-2xl font-semibold">Meet the Team</h2>

          <div className="grid grid-cols-3 gap-6 px-14">
            <Card className="flex flex-col gap-4 items-center justify-center py-8">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback />
              </Avatar>
              <div className="flex flex-col gap-2 items-center justify-center">
                <h3 className="font-semibold">Haruna Bayoh</h3>
                <h4 className="text-muted-foreground">CEO</h4>
              </div>
            </Card>
            <Card className="flex flex-col gap-4 items-center justify-center py-8">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback />
              </Avatar>
              <div className="flex flex-col gap-2 items-center justify-center">
                <h3 className="font-semibold">Patrick Chin</h3>
                <h4 className="text-muted-foreground">CTO</h4>
              </div>
            </Card>
            <Card className="flex flex-col gap-4 items-center justify-center py-8">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback />
              </Avatar>
              <div className="flex flex-col gap-2 items-center justify-center">
                <h3 className="font-semibold">Saffa Salieu</h3>
                <h4 className="text-muted-foreground">COO</h4>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section>
        <div className={cn(divcn)}>
          <h2 className="text-2xl font-semibold">Our Services</h2>

          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-6">
              <Skeleton className="h-60" />
              <p className="text-center px-1">
                We offer an online platform to help you manage and monitor your
                residential, commercial, and industrial construction projects.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <Skeleton className="h-60" />
              <p className="text-center px-1">
                Right now, we provide expert site supervisors in Sierra Leone
                and Kenya. If you&apos;re in another country, you can set up your own
                site supervision team using our platform to oversee your
                project.
              </p>
              <p className="text-center px-1">
                We plan to expand our expert supervisor services to more
                countries soon.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <Skeleton className="h-60" />
              <p className="text-center px-1">
                Our platform supports construction projects of all sizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-yellow-400">
        <div className={cn(divcn)}>
          <h2 className="text-2xl font-semibold">The Benefits</h2>

          <div className="flex flex-col gap-3">
            <p>
              Log in from anywhere in the world to monitor your construction
              site.
            </p>
            <p>
              Keep track of building materials, equipment, and machinery usage.
            </p>
            <p>
              Use built-in Zoom meetings and chat messaging for easy
              communication with your architect, engineer, contractor, and site
              supervisor.
            </p>
            <p>
              Create your team, schedule site visits, and get weekly site
              reports.
            </p>
            <p>
              Stay updated on construction progress, material quality checks,
              and workmanship inspections.
            </p>
            <p>
              Access all your stored site reports anytime in case of legal
              disputes or for reference.
            </p>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LucideCamera, LucideChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const data = [
  { date: "2/34/4", pics: 39 },
  { date: "2/34/4", pics: 39 },
  { date: "2/34/4", pics: 39 },
  { date: "2/34/4", pics: 39 },
  { date: "2/34/4", pics: 39 },
  { date: "2/34/4", pics: 39 },
  { date: "2/4/4", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/4/4", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/4/4", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/4/4", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/4/4", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/4/4", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/34/94", pics: 39 },
  { date: "2/34/94", pics: 39 },
];

function ReportsList() {
  return (
    <div className="shrink-0 flex flex-col min-h-0 w-72">
      <div className="p-4 border-b">
        <p>Search </p>
        <Input />
      </div>
      <ScrollArea className="grow min-h-0 bg-muted">
        <ol className="flex flex-col gap-2 py-2">
          {data.map((r, i) => (
            <li key={i} className="bg-background">
              <Link href="#" className="flex flex-col border-b">
                <div className="h-full w-full p-3 flex items-center">
                  <div className="grow font-bold">
                    <div>Date: {r.date}</div>
                    <div>Reporter: {r.pics}</div>
                  </div>
                  <div>
                    <LucideChevronRight />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </ScrollArea>
    </div>
  );
}

function ReportDisplay() {
  return (
    <div
      className={cn(
        "h-full w-full flex items-center justify-center",
        "bg-gradient-to-r from-cyan-100 to-blue-100",
      )}
    >
      <p className="text-2xl">work in progress</p>
    </div>
  );
}

function PictureCarosel() {
  return (
    <div className="flex min-w-0 max-h-64">
      <ScrollArea className="shrink-0 p-0 bg-muted">
        <div className="grid gap-2 w-36 py-2">
          <Link href="#">
            <div className="p-2 font-bold border w-full bg-background">All</div>
          </Link>
          <Link href="#">
            <div className="p-2 font-bold border w-full bg-background">
              Pictures
            </div>
          </Link>
          <Link href="#">
            <div className="p-2 font-bold border w-full bg-background">
              Videos
            </div>
          </Link>
          <Link href="#">
            <div className="p-2 font-bold border w-full bg-background">
              Documents
            </div>
          </Link>
        </div>
      </ScrollArea>

      <Separator orientation="vertical" />

      <ScrollArea className="grow flex items-center justify-center min-w-0">
        <ul className="inline-block gap-4 p-4 items-center">
          {data.map((r, i) => (
            <li key={i} className="inline-block mr-4 mb-4">
              <Link href="#">
                <Card className="flex justify-center items-center p-0 overflow-hidden w-36 h-36">
                  <LucideCamera />
                  <Image
                    src={""}
                    alt={"missing image"}
                    width={120}
                    height={120}
                    className="border hidden"
                  />
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}

export default function Page({ params }: { params: { report: string[] } }) {

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <main className="grow flex min-h-0 min-w-0">
        <ReportsList />
        <Separator orientation="vertical" />
        <div className="grow flex flex-col min-w-0">
          <ReportDisplay />
          <Separator />
          <PictureCarosel />
        </div>
      </main>
    </div>
  );
}

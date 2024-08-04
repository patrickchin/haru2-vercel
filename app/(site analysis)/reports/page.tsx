import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Link from "next/link";

const data = [
    { date: "2/34/4", pics: 39 },
    { date: "2/4/4", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
    { date: "2/34/94", pics: 39 },
];

function ReportsList() {
  return (
    <div className="flex flex-col min-h-0">
      <div className="p-2">
        <p>Search </p>
        <Input />
      </div>
      <ScrollArea className="grow min-h-0 bg-red-400">
        <ol className="flex flex-col">
          {data.map((r, i) => (
            <li key={i}>
              <Link
                href="#"
                className="flex flex-col h-full w-full p-3 border-b"
              >
                <div>Date: {r.date}</div>
                <div>Reporter: {r.pics}</div>
              </Link>
            </li>
          ))}
        </ol>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}

function AnotherList() {
  return (
    <div className="flex flex-col w-[32rem] min-h-0">
      <ScrollArea className="grow min-h-0">
        <ol className="flex flex-col">
          {data.map((r, i) => (
            <li key={i} className="">
              <Link
                href="#"
                className="flex flex-col h-full w-full p-2 border-b"
              >
                <div>Date: {r.date}</div>
                <div>Pictures: {r.pics}</div>
              </Link>
            </li>
          ))}
        </ol>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}

function ReportDisplay() {
    return (
      <div className="grow bg-yellow-300 flex items-center justify-center border-6">
        <p className="text-2xl">work in progress</p>
      </div>
    );
}

function PictureCarosel() {
    return (
      <ScrollArea className="min-w-0">
        <ul className="flex gap-2">
          {data.map((r, i) => (
            <li key={i}>
              <Link
                href="#"
                className="flex flex-col h-full w-full p-2"
              >
                <div>Date: {r.date}</div>
                <div>Pictures: {r.pics}</div>
              </Link>
            </li>
          ))}
        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
}

export default function Page() {

    return (
      <div className="flex flex-col max-h-screen h-screen">
        <Header />

        <ResizablePanelGroup direction="horizontal" className="flex min-h-0">
          <ResizablePanel className="flex flex-col min-h-0">
            <ReportsList />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel>
                <ReportDisplay />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <PictureCarosel />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
}
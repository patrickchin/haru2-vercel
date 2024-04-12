import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LucideAxis3D,
  LucideDownload,
  LucideFileAxis3D,
  LucideFileImage,
  LucideFileSpreadsheet,
  LucideFileText,
  LucideImage,
  LucidePlusCircle,
  LucideUpload,
  LucideView
} from "lucide-react";

export default function TaskFiles() {

  // TODO surely online should have a predefinned mapping of this
  const filetypeIcons = [
    { types: ["dwg"], icon: LucideAxis3D },
    { types: ["jpeg", "png"], icon: LucideImage },
    { types: ["xlsx", "csv", "tsv"], icon: LucideFileSpreadsheet },
    { types: ["txt"], icon: LucideFileText },
  ]

  // TODO this will eventually be in a database
  const taskFiles = [
    { name: "FloorPlanFirstFloor.dwg", icon: LucideFileAxis3D, versions: 1 },
    { name: "FloorPlanSecondFloor.dwg", icon: LucideFileAxis3D, versions: 3 },
    { name: "initialDrawing.jpeg", icon: LucideFileImage, versions: 8 },
    { name: "rendering.png", icon: LucideFileImage, versions: 8 },
  ];

  return (
      <Card>
        <CardHeader className="font-bold">
            Files
        </CardHeader>
        <CardContent className='grid grid-cols-3 gap-3 text-sm'>
          {taskFiles.map((f, i) => 
            <div key={i} className="flex flex-col gap-2 py-4 px-3 border rounded-lg">
              <div className="flex flex-nowrap gap-2 items-center justify-start px-2">
                <f.icon className="h-12 flex-none" />
                <h4 className="text-ellipsis overflow-hidden">{f.name}</h4>
              </div>
              <div className='flex flex-col gap-1'>
                <Button variant="ghost" className='flex gap-2 justify-start'>
                  <LucideView className='h-4'/>View In Browser
                </Button>
                <Button variant="ghost" className='flex gap-2 justify-start'>
                  <LucideDownload className='h-4'/>Download Latest
                </Button>
                <Button variant="ghost" className='flex gap-2 justify-start'>
                  <LucideUpload className='h-4'/>Upload New Version
                </Button>
                <ScrollArea className="h-36 border rounded-sm p-2">
                  {Array.from(Array(f.versions)).map((_, i) => 
                    <div key={i} className='border-b p-2 flex justify-between hover:bg-accent'>
                      <span>Version {f.versions - i}</span>
                      <span>{new Date(Date.now() - (i*5*24*3600*1000)).toDateString()}</span>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          )}
          <div className="flex justify-center items-center border rounded-lg">
            <Button variant="outline" className="h-16 flex gap-4">
              <LucidePlusCircle className='h-full'/> Add a New File
            </Button>
          </div>
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>
  );
}
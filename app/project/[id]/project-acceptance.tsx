"use client"

import { cn } from "@/lib/utils"
import * as React from "react"
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from "date-fns"
import { MoveRight, SquareUserRound, User } from 'lucide-react';
import { Calendar as CalendarIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import SimpleLayout from '@/components/layout';

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default function ProjectAcceptance({ projectId, }: { projectId: number }) {
  return (
    <div className='flex flex-col'>
      <p>TODO have some actual project status in the db</p>
      <div className='flex flex-row justify-between items-center'>

        <Card className='flex flex-col items-center'>
          <CardContent>
            <User className="h-32 w-32 pt-4" />
          </CardContent>
          <CardFooter>
            <CardDescription>Client</CardDescription>
          </CardFooter>
        </Card>

        <div className='flex flex-row grow-0'>
          <MoveRight className='h-20 w-20' />
        </div>
        <div className='flex flex-row space-x-2'>
          <Link href='/portfolio'>
            <Card className='flex flex-col items-center hover:bg-accent'>
              <CardContent>
                <SquareUserRound className="h-32 w-32 pt-4" />
              </CardContent>
              <CardFooter className='flex-col'>
                <h4>Designer 1</h4>
                <p>Pending</p>
              </CardFooter>
            </Card>
          </Link>

          <Link href='/portfolio'>
            <Card className='flex flex-col items-center hover:bg-accent'>
              <CardContent>
                <SquareUserRound className="h-32 w-32 pt-4" />
              </CardContent>
              <CardFooter className='flex-col'>
                <h4>Designer 2</h4>
                <p>Pending</p>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </div>

      <div>
        <p>Schedule an interview</p>
        <DatePickerDemo />
      </div>

      <div>
        <p>task management button</p>
      </div>
    </div>
  );
}

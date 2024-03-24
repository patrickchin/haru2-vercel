import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { LucideArrowUpDown, LucideChevronRight } from "lucide-react"
import Link from "next/link"

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)


import ReactTimeAgo from "react-time-ago"

export type DesignTask = {
  id: number,
  type: "legal" | "architectural" | "structural" | "mep" | "other",
  title: string,
  status: "pending" | "in progress" | "complete" | "canceled",
  lead: string, // user ids
  members: string[], // user ids
  priority: "high" | "normal" | "low",
  lastUpdated: number,
}

export type DesignTaskSpec = {
  id: number,
  designType: "legal" | "architectural" | "structural" | "mep",
  title: string,
  description: string[],
}

// a company and a way they work should be able to determine
// their own tasks saved on the platform

// will architectural and legal ect colums differ?
// this could be the common columns and can be extended upon
export const taskColumns: ColumnDef<DesignTask>[] = [
  {
    accessorKey: "title",
    size: 300,
    header: () => <div>Title</div>,
    cell: ({ row }) =>
    <div className="space-x-1">
      <Badge variant="secondary" className="capitalize">{row.original.type}</Badge>
      <Link href="#" className="font-medium">{row.getValue("title")}</Link>
    </div>
  },
  {
    accessorKey: "lead",
    size: 50,
    header: ({ column }) => {
      return (
        <Button
          className="flex flex-row overflow-hidden w-18 p-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lead
          <LucideArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex flex-row overflow-hidden w-12 items-center justify-center">
        <Avatar>
          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
          <AvatarFallback>{(row.getValue("lead") as string).slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    )
  },
  {
    accessorKey: "members",
    size: 50,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Members
          <LucideArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex flex-row overflow-hidden w-32 space-x-1">
        {(row.getValue("members") as string[]).map((mem, i) =>
          <Avatar key={i}>
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback>{mem.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
      </div>
    )
  },
  {
    accessorKey: "status",
    size: 50,
    header: "Status",
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>
  },
  // {
  //   accessorKey: "priority",
  //   size: 50,
  //   header: "Priority",
  //   cell: ({ row }) => <div className="capitalize">{row.getValue("priority")}</div>
  // },
  {
    accessorKey: "lastUpdated",
    size: 50,
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="px-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated
          <LucideArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {<ReactTimeAgo date={new Date(row.getValue("lastUpdated"))} locale="en-US" />}
      </div>
    ),
  },
  {
    accessorKey: "details",
    size: 50,
    header: () => <div className="w-8">Details</div>,
    cell: () => <Button asChild variant="outline" className="h-8 w-8 p-0">
      <Link href="#">
        <LucideChevronRight className="h-4 w-4" />
      </Link>
    </Button>
    ,
  },
]
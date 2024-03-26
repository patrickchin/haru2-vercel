"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, LucideArrowUpDown, LucideChevronRight } from "lucide-react"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import { DesignTask } from "../data/types"
import { getProjectTasks } from "../data/tasks" // todo put in actions.ts

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)
import ReactTimeAgo from "react-time-ago"

// a company and a way they work should be able to determine
// their own tasks saved on the platform

// will architectural and legal ect colums differ?
// this could be the common columns and can be extended upon
const taskColumns: ColumnDef<DesignTask>[] = [
  {
    accessorKey: "type",
    header: () => <div>Type</div>,
    cell: ({ row }) => <Badge variant="secondary" className="capitalize">{row.getValue("type")}</Badge>
  },
  {
    accessorKey: "title",
    header: () => <div>Title</div>,
    cell: ({ row }) => <Link href="#" className="font-medium">{row.getValue("title")}</Link>
  },
  {
    accessorKey: "lead",
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
    header: "Status",
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => <div>{(row.getValue("duration") as number) / (60*60*24)} days</div>
  },
  {
    accessorKey: "estimation",
    header: "Estimation",
    cell: ({ row }) => <div>{(row.getValue("estimation") as number) / (60*60*24)} days</div>
  },
  // {
  //   accessorKey: "priority",
  //   header: "Priority",
  //   cell: ({ row }) => <div className="capitalize">{row.getValue("priority")}</div>
  // },
  {
    accessorKey: "lastUpdated",
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
        <ReactTimeAgo date={new Date(row.getValue("lastUpdated"))} locale="en-US" />
      </div>
    ),
  },
  {
    accessorKey: "details",
    header: () => <div className="w-8">Details</div>,
    cell: ({ row, projectid }: any) => <Button asChild variant="outline" className="h-8 w-8 p-0">
      <Link href={`/project/${projectid}/task/${row.original.id}`}>
        <LucideChevronRight className="h-4 w-4" />
      {/* <pre>{JSON.stringify(row, null, 2)}</pre> */}
      </Link>
    </Button>
    ,
  },
]


export function DataTableDemo({ projectid, columns, data }:{
  projectid: number,
  columns: ColumnDef<DesignTask>[],
  data: DesignTask[]
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const filterButtonValues = [
    { value: undefined, label: "All"},
    { value: "legal", label: "Legal"},
    { value: "architectural", label: "Architectural"},
    { value: "structural", label: "Structural"},
    { value: "mep", label: "MEP"},
  ]

  return (
    <div className="w-full">
      <div className="flex items-center py-4 space-x-4">

        {/* row filter input box */}
        <Input
          placeholder="Filter table..."
          // value={(table.getColumn("lead")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            // table.getColumn("lead")?.setFilterValue(event.target.value)
            table.setGlobalFilter(event.target.value)
          }
          className="max-w-sm"
        />

        {filterButtonValues.map((filter) =>
          <Button variant="outline" key={filter.value}
            className={(table.getColumn("type")?.getFilterValue() as string) == filter.value ? "bg-accent" : ""}
            onClick={() => table.getColumn("type")?.setFilterValue(filter.value)}
          >
            {filter.label}
          </Button>
        )}

        { // horrible and ugly, quick and dirty, but works
          (table.getColumn("status")?.getFilterValue() as string) == "in progress" ?
            <Button variant="outline" className="bg-accent"
              onClick={() => table.getColumn("status")?.setFilterValue(undefined)}
            >
              In Progress
            </Button>
            :
            <Button variant="outline" className=""
              onClick={() => table.getColumn("status")?.setFilterValue("in progress")}
            >
              In Progress
            </Button>
        }

        {/* <Button variant="outline"
          className={(table.getColumn("status")?.getFilterValue() as string) == "in progress" ? "bg-accent" : ""}
          onClick={() => table.getColumn("status")?.setFilterValue("in progress")}
        >
          In Progress
        </Button> */}

        <div className="flex-1 text-sm text-muted-foreground">
          Selected {table.getRowCount()} row(s)
        </div>

        {/* Select columns to show dropdown
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        */}

      </div>



      {/* The table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-2 first:pl-8 last:pr-8">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2 first:pl-8 last:pr-8">
                      {flexRender(
                        cell.column.columnDef.cell,
                        { ...cell.getContext(), projectid, }
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">

        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getPaginationRowModel().rows.length} of{" "}
          {table.getRowCount()} row(s) displayed.
        </div>

        {/* pagination */}
        <div className="space-x-2">
          <Button variant="outline" size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          {/* <span>TODO number of pages</span> */}
          <Button variant="outline" size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>

      </div>
    </div>
  )
}

export default function ProjectProgress({ project, }: { project: any }) {
  return (
    <div className="flex flex-col space-y-4">

      <DataTableDemo projectid={project.id} columns={taskColumns} data={getProjectTasks(0)} />

      {/* <Tabs defaultValue="architectural" className="w-full space-y-5">
        <TabsList>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="architectural">Architectural</TabsTrigger>
          <TabsTrigger value="structural">Structural</TabsTrigger>
          <TabsTrigger value="mechanical">MEP</TabsTrigger>
        </TabsList>
        <TabsContent value="legal">
          <DataTableDemo columns={taskColumns} data={legalData} />
        </TabsContent>
        <TabsContent value="architectural">
          <DataTableDemo columns={taskColumns} data={architecturalData} />
        </TabsContent>
        <TabsContent value="structural">
          <DataTableDemo columns={taskColumns} data={[]} />
        </TabsContent>
        <TabsContent value="mechanical">
          <DataTableDemo columns={taskColumns} data={[]} />
        </TabsContent>
      </Tabs> */}

    </div>
  );
}
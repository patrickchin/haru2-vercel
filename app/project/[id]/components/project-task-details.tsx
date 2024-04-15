"use client"

import * as React from "react"
import Link from "next/link"
import * as Tan from '@tanstack/react-table'

import { ChevronDown, LucideArrowUpDown, LucideChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)
import ReactTimeAgo from "react-time-ago"

import { cn } from "@/lib/utils"
import { DesignTask } from '@/lib/types'
import { DesignProject } from '@/lib/types'

// a company and a way they work should be able to determine
// their own tasks saved on the platform

// will architectural and legal ect colums differ?
// this could be the common columns and can be extended upon
const taskColumns: Tan.ColumnDef<DesignTask>[] = [
  {
    accessorKey: "type",
    size: 1,
    header: () => <div>Type</div>,
    cell: ({ row }) => <Badge variant="secondary" className="capitalize">{row.getValue("type")}</Badge>,
  },
  {
    accessorKey: "title",
    size: 3,
    header: () => <div>Title</div>,
    cell: ({ row }) => <Link href="#" className="font-medium">{row.getValue("title")}</Link>,
  },
  {
    accessorKey: "lead",
    size: 1,
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
          <AvatarImage src={`/tmp/avatar0.png`} />
          {/* TODO */}
          {/* {(row.getValue("lead") as string) ?
            <AvatarFallback>{(row.getValue("lead") as string).slice(0, 2).toUpperCase()}</AvatarFallback>
          } */}
        </Avatar>
      </div>
    )
  },
  {
    accessorKey: "status",
    size: 1,
    header: "Status",
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>
  },
  // {
  //   accessorKey: "duration",
  //   size: 2,
  //   header: "Duration",
  //   cell: ({ row }) => {
  //     const duration = row.getValue("duration") as number;
  //     // const estimation = row.getValue("estimation") as number;
  //     const estimation = row.original.estimation as number;
  //     const percent = (100 * duration / estimation);
  //     const color = percent <= 100 ? "bg-green-300" : "bg-red-300";
  //     const daysremaining = (estimation - duration) / (3600*24*1000);
  //     return (<div>
  //       <Progress value={percent} indicatorColor={color} />
  //       {percent > 100 ? "overdue" : `${daysremaining} days left`}
  //     </div>);
  //   }
  // },
  {
    accessorKey: "lastUpdated",
    size: 1,
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="px-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated
          <LucideArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">
       {/* <ReactTimeAgo date={row.getValue("lastUpdated")} locale="en-US" /> */}
       <ReactTimeAgo date={0} locale="en-US" />
      </div>
    ),
  },
  {
    accessorKey: "details",
    size: 1,
    header: () => <div className="w-8">Details</div>,
    cell: ({ row, projectid }: any) => <Button asChild variant="outline" className="h-8 w-8 p-0">
      <Link href={`/project/${projectid}/task/${row.original.specid}`}>
        <LucideChevronRight className="h-4 w-4" />
      </Link>
    </Button>
    ,
  },
]

function DataTableFilterToggles({ table }:{ table: Tan.Table<DesignTask> }) {

  const filterTypeButtonValues = [
    { value: undefined, label: "Any Team"},
    { value: "legal", label: "Legal"},
    { value: "architectural", label: "Architectural"},
    { value: "structural", label: "Structural"},
    { value: "mep", label: "MEP"},
  ]

  const filterStatusButtonValues = [
    { value: undefined, label: "Any Status"},
    { value: "pending", label: "Pending"},
    { value: "in progress", label: "In Progress"},
    { value: "complete", label: "Complete"},
  ]

  return (
    <div className="flex flex-col w-full">

      <div className="w-full flex space-x-4">
        <Input
          placeholder="Filter table..."
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />

        <div className="w-full flex items-center space-x-4">
          {filterStatusButtonValues.map((filter) =>
            <Button variant="outline" key={filter.value || ""}
              className={(table.getColumn("status")?.getFilterValue() as string) == filter.value ? "bg-accent" : ""}
              onClick={() => table.getColumn("status")?.setFilterValue(filter.value)}
            >
              {filter.label}
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground hidden sm:visible">
          Selected {table.getRowCount()} row(s)
        </div>

      </div>

      <div className="w-full flex items-center py-4 justify-between">

        <div className="w-full flex items-center space-x-4">
          {filterTypeButtonValues.map((filter) =>
            <Button variant="outline" key={filter.value || ""}
              className={(table.getColumn("type")?.getFilterValue() as string) == filter.value ? "bg-accent" : ""}
              onClick={() => table.getColumn("type")?.setFilterValue(filter.value)}
            >
              {filter.label}
            </Button>
          )}
        </div>

        {/* Select columns to show dropdown */}
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

      </div>
    </div>
  );
}

function DataTableHeader({ table }:{ table: Tan.Table<DesignTask> }) {

  const sizeToBasis = (size: number) =>
    size == 1 ?  "flex-basis-1/12":
    size == 2 ?  "flex-basis-2/12":
    size == 3 ?  "flex-basis-3/12":
    "";

  return (
    <TableHeader>
      <TableRow>
        {table.getFlatHeaders().map((header) => {
          return (
            <TableHead key={header.id} className=
                {cn("px-2 first:pl-8 last:pr-8", sizeToBasis(header.getSize()))}
                style={{ width: `${header.getSize()}px` }}
            >
              {header.isPlaceholder
                ? null
                : Tan.flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
            </TableHead>
          )
        })}
      </TableRow>
    </TableHeader>
  );
}

function DataTableBody({ projectid, table, columns }:{
  projectid: number,
  table: Tan.Table<DesignTask>, 
  columns: Tan.ColumnDef<DesignTask>[],
 }) {

  const rows = table.getRowModel().rows;

  if (rows.length == 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  function EmptyRows({ n }:{ n: number }) {
    return Array.from(Array(n).keys()).map((i) =>
      <TableRow key={i} className="h-[73px]">
        <TableCell></TableCell>
      </TableRow>);
  }

  return (
    <TableBody>
      {rows.map((row) =>
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id} className="px-1 first:pl-8 last:pr-8">
              {Tan.flexRender(
                cell.column.columnDef.cell,
                { ...cell.getContext(), projectid, }
              )}
            </TableCell>
          ))}
        </TableRow>
      )}
      <EmptyRows n={10-rows.length} />
    </TableBody>
  );
}

function DataTable({ projectid, columns, data }:{
  projectid: number,
  columns: Tan.ColumnDef<DesignTask>[],
  data: DesignTask[],
}) {
  const [sorting, setSorting] = React.useState<Tan.SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<Tan.ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<Tan.VisibilityState>({})

  const table = Tan.useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: Tan.getCoreRowModel(),
    getPaginationRowModel: Tan.getPaginationRowModel(),
    getSortedRowModel: Tan.getSortedRowModel(),
    getFilteredRowModel: Tan.getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="w-full">

      <DataTableFilterToggles table={table} />

      {/* The table */}
      <div className="rounded-md border">
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody projectid={projectid} table={table} columns={columns} />
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

export function ProjectTaskDetailsSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      Loading ...
    </div>
  );
}

export default function ProjectTaskDetails({ project, tasks }: { project: DesignProject, tasks: DesignTask[] }) {
  return (
    <Card>
      <CardContent className="pt-8">
        <DataTable projectid={project.id} columns={taskColumns} data={tasks} />
      </CardContent>
    </Card>
  );
}
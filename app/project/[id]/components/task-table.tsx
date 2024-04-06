"use client"

import * as React from "react"
import Link from "next/link"
import * as Tan from '@tanstack/react-table'

import { ChevronDown, LucideArrowUpDown, LucideChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"

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
const taskColumns: Tan.ColumnDef<DesignTask>[] = [
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
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number;
      // const estimation = row.getValue("estimation") as number;
      const estimation = row.original.estimation as number;
      const percent = (100 * duration / estimation);
      const color = percent <= 100 ? "bg-green-300" : "bg-red-300";
      return (<div>
        <Progress value={percent} indicatorColor={color} />
        {percent.toFixed(0)} % complete
      </div>);
    }
  },
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
      </Link>
    </Button>
    ,
  },
]

function TaskTableFilterToggles({ table }:{ table: Tan.Table<DesignTask> }) {

  const filterTypeButtonValues = [
    { value: undefined, label: "All"},
    { value: "legal", label: "Legal"},
    { value: "architectural", label: "Architectural"},
    { value: "structural", label: "Structural"},
    { value: "mep", label: "MEP"},
  ]

  const filterStatusButtonValues = [
    // { value: undefined, label: "All"},
    { value: "pending", label: "Pending"},
    { value: "in progress", label: "In Progress"},
    { value: "complete", label: "Complete"},
  ]

  return (
    <div className="flex flex-col w-full">

      <div className="w-full flex items-center py-4 space-x-4">
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

        <div className="text-sm text-muted-foreground">
          Selected {table.getRowCount()} row(s)
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


export default function TaskTable({ projectid, data }:{
  projectid: number,
  data: DesignTask[]
}) {
  const [sorting, setSorting] = React.useState<Tan.SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<Tan.ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<Tan.VisibilityState>({
    type: false
  })
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });

  const table = Tan.useReactTable({
    data,
    columns: taskColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
    getCoreRowModel: Tan.getCoreRowModel(),
    getPaginationRowModel: Tan.getPaginationRowModel(),
    getSortedRowModel: Tan.getSortedRowModel(),
    getFilteredRowModel: Tan.getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  })

  return (
    <div className="w-full">

      { false && <TaskTableFilterToggles table={table} /> }

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
                        : Tan.flexRender(
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
                      {Tan.flexRender(
                        cell.column.columnDef.cell,
                        { ...cell.getContext(), projectid, }
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={taskColumns.length} className="h-24 text-center">
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

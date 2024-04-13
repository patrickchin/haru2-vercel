"use client"

import * as React from "react"
import * as Tan from '@tanstack/react-table'

import { LucideChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { getProjectFiles } from "@/lib/actions"

type FileInfoArr = Awaited<ReturnType<typeof getProjectFiles>>;
type FileInfo = FileInfoArr[0];

const taskColumns: Tan.ColumnDef<FileInfo>[] = [
  {
    accessorKey: "filename",
    header: () => <div>Filename</div>,
    cell: ({ row }) => <pre>{row.getValue("filename")}</pre>
  },
  {
    accessorKey: "view",
    header: () => <div>View</div>,
    cell: ({ row }) =>
      (<Button asChild className="p-2 w-9" variant="secondary">
          <LucideChevronRight />
      </Button>),
    size: 60,
  },
  // date uploaded
  // uploader
  // filesize
  // type
  // view button
  // version?
  // which task
  // which team
]

export function DataTable({ columns, data }:{
  columns: Tan.ColumnDef<FileInfo>[],
  data: FileInfoArr
}) {

  const table = Tan.useReactTable({
    data,
    columns,
    getCoreRowModel: Tan.getCoreRowModel(),
    getPaginationRowModel: Tan.getPaginationRowModel(),
  })

  return (
    <div className="w-full">

      {/* The table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-2 first:pl-8 last:pr-8"
                        style={{ width: header.getSize() }} >
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
                        cell.getContext()
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

export function ProjectFilesSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      Loading ...
    </div>
  );
}

export default function ProjectFiles({ files }: { files: FileInfoArr }) {
  return (
    <div className="flex flex-col space-y-4">
      <DataTable columns={taskColumns} data={files} />
    </div>
  );
}
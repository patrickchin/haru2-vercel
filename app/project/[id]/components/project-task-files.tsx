"use client";

import * as React from "react";
import * as Tan from "@tanstack/react-table";
import Link from "next/link";

import { LucideChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { getProjectFiles } from "@/lib/actions";
import { DesignFile, DesignProject } from "@/lib/types";
import { UserAvatar } from "@/components/user-avatar";
import { Input } from "@/components/ui/input";

const filesColumns: Tan.ColumnDef<DesignFile>[] = [
  {
    accessorKey: "filename",
    header: () => <div>Filename</div>,
    cell: ({ row }) => <pre>{row.getValue("filename")}</pre>,
  },
  {
    accessorKey: "uploaded",
    header: () => <div>Uploaded</div>,
    cell: ({ row }) => (
      <pre>
        {/* TODO */}
        <time dateTime={"05/22/2024T12:20"}>
          {new Date("2024-05-22T12:20").toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
        </time>
      </pre>
    ),
  },
  {
    accessorKey: "uploader",
    header: () => <div>Uploader</div>,
    //cell: ({ row }) => <pre>{row.getValue("uploaderid")}</pre>,
    cell: ({ row }) => (
      <div className="w-full flex overflow-hidden w-12 items-center justify-center">
        {/* TODO (row.getValue("uploader") as string) */}
        <UserAvatar user={undefined} />
      </div>
    ),
  },
  {
    accessorKey: "filesize",
    header: () => <div>Size</div>,
    cell: ({ row }) => <pre>{row.getValue("filesize")}</pre>,
  },
  {
    accessorKey: "taskid",
    header: () => <div>Task Id</div>,
    //cell: ({ row }) => <pre>{row.getValue("taskid")}</pre>,
    cell: ({ row, projectid }: any) => (
      <div className="text-center">
        <Button asChild variant="outline" className="h-8 w-8 p-0">
          <Link href={`/project/${projectid}/task/${row.getValue("taskid")}`}>
            <pre>{row.getValue("taskid")}</pre>
          </Link>
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "view",
    header: () => <div>View</div>,
    cell: ({ row }) => (
      <Button asChild className="p-2 w-9" variant="secondary">
        <LucideChevronRight />
      </Button>
    ),
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
];

function FilesTable({
  columns,
  data,
  projectid,
}: {
  columns: Tan.ColumnDef<DesignFile>[];
  data: DesignFile[];
  projectid: number;
}) {
  const table = Tan.useReactTable({
    data,
    columns,
    getCoreRowModel: Tan.getCoreRowModel(),
    getPaginationRowModel: Tan.getPaginationRowModel(),
  });
  console.log("Data:", data);
  console.log("projectid:", projectid);

  return (
    <div className="w-full space-y-4">
      {/* The table */}
      {<FileTableFilterToggles table={table} />}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="px-2 first:pl-8 last:pr-8"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : Tan.flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
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
                      {Tan.flexRender(cell.column.columnDef.cell, { ...cell.getContext(), projectid })}
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
          Showing {table.getPaginationRowModel().rows.length} of {table.getRowCount()} row(s) displayed.
        </div>

        {/* pagination */}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          {/* <span>TODO number of pages</span> */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProjectFilesSkeleton() {
  return <div className="flex flex-col space-y-4">Loading ...</div>;
}

export default function ProjectFiles({ files, project }: { files: DesignFile[]; project: DesignProject }) {
  console.log(project);
  return (
    <Card>
      <CardContent className="pt-8">
        <FilesTable columns={filesColumns} data={files} projectid={project?.id} />
      </CardContent>
    </Card>
  );
}

function FileTableFilterToggles({ table }: { table: Tan.Table<DesignFile> }) {
  return (
    <div className="w-full flex items-center gap-3 justify-between">
      <div className="flex gap-3 items-center justify-start">
        {/* row filter input box */}
        <Input
          placeholder="Filter table..."
          // value={(table.getColumn("lead")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            // table.getColumn("lead")?.setFilterValue(event.target.value)
            table.setGlobalFilter(event.target.value)
          }
          className="max-w-sm grow"
        />
      </div>
    </div>
  );
}

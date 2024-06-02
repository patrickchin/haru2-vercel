"use client";

import * as React from "react";
import * as Tan from "@tanstack/react-table";
import Link from "next/link";
import prettyBytes from "pretty-bytes";
import { LucideArrowUpRight, LucideChevronRight, LucideDownload, LucideMoveRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAvatar } from "@/components/user-avatar";
import { Input } from "@/components/ui/input";

import { DesignFile, DesignProject, DesignTask } from "@/lib/types";
import DateTime from "@/components/date-time";
import { cn } from "@/lib/utils";

const filesColumns: Tan.ColumnDef<DesignFile>[] = [
  {
    accessorKey: "filename",
    header: () => <div>Filename</div>,
    cell: ({ row }) => <div className="font-semibold">{row.getValue("filename")}</div>,
    size: 6,
  },
  {
    accessorKey: "filesize",
    header: () => <div>Size</div>,
    cell: ({ row }) => <div>{prettyBytes(row.getValue("filesize"))}</div>,
    size: 2,
  },
  {
    accessorKey: "uploader",
    header: () => <div className="text-center">Uploader</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <UserAvatar user={row.getValue("uploader")} className="w-8 h-8" />
      </div>
    ),
    size: 3,
  },
  {
    accessorKey: "uploadedat",
    header: () => <div>Uploaded</div>,
    cell: ({ row }) => {
      return (
        <div>
          <DateTime date={row.getValue("uploadedat")} />
        </div>
      );
    },
    size: 4,
  },
  {
    accessorKey: "task",
    header: () => <div>Task</div>,
    cell: ({ row }) => {
      // TODO how do I filter on task title??
      const file: DesignFile = row.original;
      const task: DesignTask | null = file.task;
      const projectid = file.projectid ?? file.task?.projectid;
      const commentid = file.commentid;
      const commentHash = commentid ? `#comment-${commentid}` : "";
      return (
        <Button size="sm" variant="link" className="h-8 p-0" disabled={!task}>
          {task ? (
            <Link
              href={`/project/${projectid}/task/${task.specid}${commentHash}`}
              className="flex gap-1 items-center font-normal"
            >
              {task.title}
              <LucideArrowUpRight className="h-4 w-4" />
            </Link>
          ) : (
            <div>-</div>
          )}
        </Button>
      );
    },
    size: 4,
  },
  {
    accessorKey: "url",
    header: () => <div>Download</div>,
    cell: ({ row }) => {
      const url = row.getValue("url") || "#";
      return (
        <div className="flex  justify-center">
        <Button size="icon" variant="outline" className="h-8 w-8">
          <Link href={url} target="_blank">
            <LucideDownload className="w-3.5 h-3.5" />
          </Link>
        </Button>
        </div>
      );
    },
    size: 1,
  },
];

function FilesTable({
  columns,
  data,
}: {
  columns: Tan.ColumnDef<DesignFile>[];
  data: DesignFile[];
}) {
  const [sorting, setSorting] = React.useState<Tan.SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<Tan.ColumnFiltersState>([]);

  const table = Tan.useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: Tan.getCoreRowModel(),
    getPaginationRowModel: Tan.getPaginationRowModel(),
    getSortedRowModel: Tan.getSortedRowModel(),
    getFilteredRowModel: Tan.getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    defaultColumn: {
      size: 200, //starting column size
      minSize: 1, //enforced during column resizing
      maxSize: 500, //enforced during column resizing
    },
  });

  const sizeToTailwind = (size?: number) => {
    if (!size) return "";
    switch (size) {
      case 0:
        return "w-0";
      case 1:
        return "w-8";
      case 2:
        return "w-16";
      case 3:
        return "w-32";
      case 4:
        return "w-48";
      case 5:
        return "w-64";
      case 6:
        return "";
    }
  };

  return (
    <div className="w-full space-y-4">
      <FileTableFilterToggles table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader className="w-full border-b">
            <TableRow>
              {table.getFlatHeaders().map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "p-2 first:pl-8 last:pr-8",
                      sizeToTailwind(header.getSize()),
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : Tan.flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "p-2 first:pl-8 last:pr-8",
                        sizeToTailwind(cell.column.getSize()),
                      )}
                    >
                      {Tan.flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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

export default function ProjectFiles({
  files,
  project,
}: {
  files: DesignFile[];
  project: DesignProject;
}) {
  return (
    <Card>
      <CardContent className="pt-8">
        <FilesTable
          columns={filesColumns}
          data={files}
        />
      </CardContent>
    </Card>
  );
}

function FileTableFilterToggles({ table }: { table: Tan.Table<DesignFile> }) {
  return (
    <div className="w-full flex items-center gap-3 justify-between">
      <Input
        placeholder="Filter by file name ..."
        onChange={(event) => {
          table.setGlobalFilter(event.target.value);
        }}
        className="max-w-sm grow"
      />
    </div>
  );
}

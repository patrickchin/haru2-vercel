"use client";

import * as React from "react";
import * as Tan from "@tanstack/react-table";
import Link from "next/link";
import prettyBytes from "pretty-bytes";
import {
  LucideArrowUpRight,
  LucideDownload,
  ArrowDown,
  ArrowUp,
  ChevronDown,
} from "lucide-react";

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
import DeleteAlertDialog from "@/components/delete-alert";
import { deleteFile } from "@/lib/actions";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "@/components/ui/pagination";

const deleteProfileAvatar = (id: number) => {
  try {
    deleteFile(id);
    location.reload();
  } catch (error) {
    console.log(`Error happened:`, error);
  }
};

const columnLabels: { [key: string]: string } = {
  id: "Delete",
  url: "Download",
};

const filesColumns: Tan.ColumnDef<DesignFile>[] = [
  {
    accessorKey: "filename",
    header: () => <div>Filename</div>,
    cell: ({ row }) => (
      <div className="font-semibold">{row.getValue("filename")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "filesize",
    header: () => <div>Size</div>,
    cell: ({ row }) => (
      <div className="text-nowrap">
        {prettyBytes(row.getValue("filesize") ?? 0)}
      </div>
    ),
    size: 60,
    enableSorting: true,
  },
  {
    accessorKey: "uploader",
    header: () => <div className="text-center">Uploader</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <UserAvatar user={row.getValue("uploader")} className="w-8 h-8" />
      </div>
    ),
    size: 40,
    enableSorting: true,
  },
  {
    accessorKey: "uploadedat",
    header: () => <div>Uploaded Date</div>,
    cell: ({ row }) => {
      return (
        <div>
          <DateTime date={row.getValue("uploadedat")} />
        </div>
      );
    },
    size: 180,
    enableSorting: true,
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
    size: 70,
    enableSorting: true,
  },
  {
    accessorKey: "url",
    header: () => <div className="flex justify-center">Download</div>,
    cell: ({ row }) => {
      const url = row.getValue("url") || "#";
      return (
        <div className="flex justify-center">
          <Button size="icon" variant="outline" className="h-8 w-8">
            <Link href={url} target="_blank">
              <LucideDownload className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      );
    },
    size: 30,
    enableSorting: false,
  },
  {
    accessorKey: "id",
    header: () => <div className="flex justify-center">Delete file</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <DeleteAlertDialog
            onConfirm={() => deleteProfileAvatar(row.getValue("id"))}
            isIcon={true}
          />
        </div>
      );
    },
    size: 40,
    enableSorting: false,
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
                    className="p-2 first:pl-8 last:pr-8"
                    style={{ width: `${header.getSize()}rem` }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center cursor-pointer">
                        {Tan.flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: <ArrowUp className="w-3.5 h-3.5" />,
                          desc: <ArrowDown className="w-3.5 h-3.5" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
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
                      className="px-2 py-4 first:pl-8 last:pr-8"
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
        <DataTablePagination table={table} />
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
        <FilesTable columns={filesColumns} data={files} />
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnLabels[column.id] || column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

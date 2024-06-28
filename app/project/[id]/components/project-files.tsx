"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Tan from "@tanstack/react-table";
import prettyBytes from "pretty-bytes";
import {
  LucideArrowUpRight,
  LucideDownload,
  LucideChevronDown,
} from "lucide-react";
import { getTimeAgo } from "@/lib/utils";
import { DesignFile, DesignProject, DesignTask } from "@/lib/types";
import { deleteFile } from "@/lib/actions";

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
import DeleteAlertDialog from "@/components/delete-alert";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "@/components/ui/pagination";
import { toast } from "@/components/ui/use-toast";
import CustomTooltip from "@/components/ui/tooltip-custom";
import ColumnSortHeader from "@/components/ui/column-sort";

const columnLabels: { [key: string]: string } = {
  filesize: "Size",
  uploadedat: "Upload Date",
  task_title: "Task",
  actions: "Actions",
};

const filesColumns: (
  deleteProfileAvatar: (id: number) => void,
) => Tan.ColumnDef<DesignFile>[] = (deleteProfileAvatar) => [
  {
    accessorKey: "filename",
    header: ({ column }) => (
      <ColumnSortHeader label="Filename" column={column} />
    ),
    cell: ({ row }) => (
      <div className="font-semibold">{row.getValue("filename")}</div>
    ),
    size: 300,
    enableSorting: true,
  },
  {
    accessorKey: "filesize",
    header: ({ column }) => <ColumnSortHeader label="Size" column={column} />,
    cell: ({ row }) => (
      <div className="text-nowrap text-right">
        {prettyBytes(row.getValue("filesize") ?? 0)}
      </div>
    ),
    size: 0,
    enableSorting: true,
  },
  {
    accessorKey: "uploader",
    header: ({ column }) => (
      <ColumnSortHeader label="Uploader" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <UserAvatar user={row.getValue("uploader")} className="w-8 h-8" />
      </div>
    ),
    size: 0,
    enableSorting: true,
  },
  {
    accessorKey: "uploadedat",
    header: ({ column }) => (
      <ColumnSortHeader label="Upload Date" column={column} />
    ),
    cell: ({ row }) => {
      // TODO hover show full date
      return <div>{getTimeAgo(row.getValue("uploadedat"))}</div>;
    },
    size: 0,
    enableSorting: true,
  },
  {
    // does this work or not!? it works locally
    accessorKey: "task.title",
    header: ({ column }) => <ColumnSortHeader label="Task" column={column} />,
    cell: ({ row }) => {
      const file: DesignFile = row.original;
      const task: DesignTask | null = file.task;
      const projectid = file.projectid ?? file.task?.projectid;
      const commentid = file.commentid;
      const commentHash = commentid ? `#comment-${commentid}` : "";
      return (
        <Button size="sm" variant="link" className="h-8 p-0" disabled={!task}>
          {task ? (
            <>
              <Link
                href={`/project/${projectid}/task/${task.specid}${commentHash}`}
                className="flex gap-1 items-center font-normal"
              >
                {task.title}
                <LucideArrowUpRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <div>-</div>
          )}
        </Button>
      );
    },
    size: 300,
    enableSorting: true,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const url = row.original.url || "#";
      return (
        <div className="flex justify-center gap-2">
          <CustomTooltip label="Download">
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Link href={url} target="_blank">
                <LucideDownload className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </CustomTooltip>
          <DeleteAlertDialog
            variant="icon"
            onConfirm={() => deleteProfileAvatar(row.original.id)}
          />
        </div>
      );
    },
    size: 0,
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
      size: 200,
      minSize: 1,
      maxSize: 500,
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
                    className="px-3 border-r last:border-r-0"
                    style={{ width: `${header.getSize()}px` }}
                    onClick={header.column.getToggleSortingHandler()}
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
                      className="px-3 border-r last:border-r-0"
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
  const router = useRouter();
  const deleteProfileAvatar = async (id: number) => {
    try {
      await deleteFile(id);
    } catch (error) {
      toast({ description: `Error happened:${error}` });
    }
    router.refresh();
  };
  return (
    <Card>
      <CardContent className="pt-8">
        <FilesTable columns={filesColumns(deleteProfileAvatar)} data={files} />
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
            Columns <LucideChevronDown className="ml-2 h-4 w-4" />
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

"use client";

import * as React from "react";
import Link from "next/link";
import * as Tan from "@tanstack/react-table";

import {
  ChevronDown,
  LucideArrowUpDown,
  LucideChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DesignTask } from "@/lib/types";
import { cn } from "@/lib/utils";

// a company and a way they work should be able to determine
// their own tasks saved on the platform

// will architectural and legal ect colums differ?
// this could be the common columns and can be extended upon
const taskColumns: Tan.ColumnDef<DesignTask>[] = [
  {
    accessorKey: "type",
    size: 64,
    header: () => <div className="text-center">Team</div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <Badge variant="secondary" className="capitalize">
          {row.getValue("type")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "title",
    size: 6 * 64,
    header: () => <div className="text-start pl-6">Title</div>,
    cell: ({ row, projectid }: any) => (
      <Link
        href={`/project/${projectid}/task/${row.original.specid}`}
        className="font-medium pl-6"
      >
        {row.getValue("title")}
      </Link>
    ),
  },
  {
    accessorKey: "lead",
    size: 64,
    maxSize: 64,
    header: () => <div className="text-center">Lead</div>,
    cell: ({ row }) => (
      <div className="w-full flex overflow-hidden w-12 items-center justify-center">
        <Avatar>
          <AvatarImage src={`/tmp/avatar0.png`} />
          {/* TODO */}
          {/* {(row.getValue("lead") as string) ?
            <AvatarFallback>{(row.getValue("lead") as string).slice(0, 2).toUpperCase()}</AvatarFallback>
          } */}
        </Avatar>
      </div>
    ),
  },
  {
    accessorKey: "status",
    size: 64,
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => (
      <div className="text-center capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "details",
    size: 64,
    header: () => <div className="text-center">Details</div>,
    cell: ({ row, projectid }: any) => (
      <div className="text-center">
        <Button asChild variant="outline" className="h-8 w-8 p-0">
          <Link href={`/project/${projectid}/task/${row.original.specid}`}>
            <LucideChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    ),
  },
];

function TaskTableHeader({ table }: { table: Tan.Table<DesignTask> }) {
  const sizeToBasis = (size: number) =>
    size == 1
      ? "flex-basis-1"
      : size == 2
        ? "flex-basis-2"
        : size == 3
          ? "flex-basis-3"
          : "";

  return (
    <TableHeader>
      <TableRow>
        {table.getFlatHeaders().map((header) => {
          return (
            <TableHead
              key={header.id}
              className={cn(
                "px-3 border-r last:border-r-0",
                false && sizeToBasis(header.getSize()),
              )}
              style={{ width: `${header.getSize()}px` }}
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
  );
}

function TaskTableBody({
  projectid,
  table,
  columns,
}: {
  projectid: number;
  table: Tan.Table<DesignTask>;
  columns: Tan.ColumnDef<DesignTask>[];
}) {
  const rows = table.getRowModel().rows;
  const pageSize = table.getState().pagination.pageSize;

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

  function EmptyRows({ n }: { n: number }) {
    return Array.from(Array(n).keys()).map((i) => (
      <TableRow key={i} className="h-[73px]">
        <TableCell></TableCell>
      </TableRow>
    ));
  }

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id} className="px-3 border-r last:border-r-0">
              {Tan.flexRender(cell.column.columnDef.cell, {
                ...cell.getContext(),
                projectid,
              })}
            </TableCell>
          ))}
        </TableRow>
      ))}
      <EmptyRows n={pageSize - rows.length} />
    </TableBody>
  );
}

function TaskTableFilterToggles({ table }: { table: Tan.Table<DesignTask> }) {

  const statusValues = ["all", "pending", "in progress", "complete"];
  const teamValues = ["all", "legal", "architectural", "structural", "mep"];

  const [statusFilter, setStatusFilter] = React.useState(statusValues[0]);
  const [teamFilter, setTeamFilter] = React.useState(teamValues[0]);

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto capitalize">
              Status: {statusFilter} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={statusFilter}
              onValueChange={(filter) => {
                setStatusFilter(filter);
                table
                  .getColumn("status")
                  ?.setFilterValue(filter !== "all" ? filter : undefined);
              }}
            >
              {statusValues.map((status) => {
                return (
                  <DropdownMenuRadioItem
                    key={status}
                    value={status}
                    className="py-3 pr-6 capitalize"
                  >
                    {status}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto capitalize">
              Team: {teamFilter} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={teamFilter}
              onValueChange={(filter) => {
                setTeamFilter(filter);
                table
                  .getColumn("type")
                  ?.setFilterValue(filter !== "all" ? filter : undefined);
              }}
            >
              {teamValues.map((team) => {
                return (
                  <DropdownMenuRadioItem
                    key={team}
                    value={team}
                    className="py-3 pr-6 capitalize"
                  >
                    {team}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex gap-3 items-center">
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
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function TaskTableFooter({ table }: { table: Tan.Table<DesignTask> }) {
  return (
    <div className="flex items-center justify-end space-x-2">
      <div className="flex-1 text-sm text-muted-foreground pl-1">
        Showing {table.getPaginationRowModel().rows.length} of{" "}
        {table.getRowCount()} row(s) displayed.
      </div>

      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
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
  );
}

export default function TaskTable({
  projectid,
  data,
  showTypeColumn = true,
  pageSize = 5,
  showFilterToggles = true,
}: {
  projectid: number;
  data: DesignTask[];

  showFilterToggles?: boolean;
  showTypeColumn?: boolean;
  pageSize?: number;
}) {
  const [sorting, setSorting] = React.useState<Tan.SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<Tan.ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<Tan.VisibilityState>({
      type: showTypeColumn,
    });
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: pageSize,
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
  });

  return (
    <div className="w-full space-y-4">
      {showFilterToggles && <TaskTableFilterToggles table={table} />}

      {/* The table */}
      <div className="rounded-md border">
        <Table>
          <TaskTableHeader table={table} />
          <TaskTableBody
            projectid={projectid}
            table={table}
            columns={taskColumns}
          />
        </Table>
      </div>

      <TaskTableFooter table={table} />
    </div>
  );
}

"use client";

import * as React from "react";
import * as Actions from "@/lib/actions";
import { SiteReport, SiteEquipment } from "@/lib/types";
import useSWR from "swr";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LucideLoaderCircle } from "lucide-react";

export const columns: ColumnDef<SiteEquipment>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 300,
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-right">Quantity</div>,
    size: 75,
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as string;
      return <div className="text-right font-medium">{quantity}</div>;
    },
  },
  {
    accessorKey: "cost",
    header: () => <div className="text-right">Unit Cost</div>,
    size: 150,
    cell: ({ row }) => {
      const amount = row.original.cost ? parseFloat(row.original.cost) : 0;
      const currency = row.original.costUnits;
      return (
        <div className="text-right font-medium">
          {amount ? amount.toLocaleString() : "-"} {currency ?? "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "condition",
    header: () => <div className="text-left">Condition</div>,
    size: 150,
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium">{row.getValue("condition")}</div>
      );
    },
  },
  {
    accessorKey: "ownership",
    header: () => <div className="text-left">Ownership</div>,
    size: 150,
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium capitalize">
          {row.getValue("ownership")}
        </div>
      );
    },
  },
  {
    accessorKey: "operationTimeHours",
    header: () => <div className="text-center">Operation Time (Hours)</div>,
    size: 150,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue("operationTimeHours")}
        </div>
      );
    },
  },
];

function EquipmentTable({
  equipment,
  isLoading,
  exportFilename,
}: {
  equipment?: SiteEquipment[];
  isLoading: boolean;
  exportFilename: string;
}) {
  const table = useReactTable({
    data: equipment ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full pl-1">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter equipment names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-center"
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 flex justify-center items-center"
                >
                  <LucideLoaderCircle className="animate-spin size-4" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
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
    </div>
  );
}

export function UsedEquipmentTable({
  reportId,
  activityId,
}: {
  reportId: number;
  activityId: number;
}) {
  const { data: equipment, isLoading } = useSWR(
    `/api/activityId/${activityId}/used-equipment`,
    () => Actions.listSiteActivityUsedEquipment({ activityId }),
  );

  return (
    <EquipmentTable
      equipment={equipment}
      exportFilename={`harpapro-${new Date().getTime()}-report-#${reportId}-equipment-used-activity=#${activityId}.csv`}
      isLoading={isLoading}
    />
  );
}

export function InventoryEquipmentTable({ report }: { report?: SiteReport }) {
  const { data: equipment, isLoading } = useSWR(
    `/api/report/${report?.id}/inventory-equipment`,
    () =>
      report?.id
        ? Actions.listSiteReportInventoryEquipment(report.id)
        : undefined,
  );

  return (
    <EquipmentTable
      equipment={equipment}
      exportFilename={`harpapro-${new Date().getTime()}-report-#${report?.id}-equipment-storage.csv`}
      isLoading={isLoading}
    />
  );
}

"use client";

import * as React from "react";
import * as Actions from "@/lib/actions";
import { SiteMaterial } from "@/lib/types";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<SiteMaterial>[] = [
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
    accessorKey: "quantityUnit",
    header: () => <div className="text-left">Unit</div>,
    size: 75,
    cell: ({ row }) => {
      const units = row.getValue("quantityUnit") as string;
      return <div className="text-left font-medium">{units}</div>;
    },
  },
  {
    accessorKey: "unitCost",
    header: () => <div className="text-right">Unit Cost</div>,
    size: 150,
    cell: ({ row }) => {
      const amount = row.original.unitCost
        ? parseFloat(row.original.unitCost)
        : 0;
      const currency = row.original.unitCostCurrency;
      return (
        <div className="text-right font-medium">
          {amount ? amount.toLocaleString() : "-"} {currency ?? "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "totalCost",
    header: () => <div className="text-right">Total Cost</div>,
    size: 150,
    cell: ({ row }) => {
      const quantity = row.original.quantity ?? 0;
      const cost = row.original.unitCost
        ? parseFloat(row.original.unitCost)
        : 0;
      const currency = row.original.unitCostCurrency;
      const total = quantity * cost;
      return (
        <div className="text-right font-medium">
          {total ? total.toLocaleString() : "-"} {currency ?? "-"}
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
];

function MaterialsTable({
  materials,
  isLoading,
}: {
  materials?: SiteMaterial[];
  isLoading: boolean;
}) {
  const table = useReactTable({
    data: materials ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const totalCostsByCurrency = React.useMemo(() => {
    const totals: Record<string, number> = {};
    (materials ?? []).forEach((mat) => {
      const quantity = mat.quantity ?? 0;
      const cost = mat.unitCost ? parseFloat(mat.unitCost) : 0;
      const currency = mat.unitCostCurrency || "-";
      const total = quantity * cost;
      if (!totals[currency]) totals[currency] = 0;
      totals[currency] += total;
    });
    return totals;
  }, [materials]);

  return (
    <div className="w-full h-full pl-1 flex flex-col gap-2 min-h-0 grow">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter material names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <ScrollArea className="flex-1 min-h-0 rounded-md border max-w-full overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap"
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
                  className="h-24 flex justify-center items-center whitespace-nowrap"
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
                    <TableCell key={cell.id} className="whitespace-nowrap">
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
                  className="h-24 text-center whitespace-nowrap"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex flex-wrap gap-2 items-center text-sm border rounded p-2">
        <span className="p-2 font-bold">Total Costs:</span>
        {Object.entries(totalCostsByCurrency).map(([currency, total]) => (
          <div key={currency} className="p-2 font-bold">
            {total ? total.toLocaleString() : 0} {currency}
          </div>
        ))}
      </div>
    </div>
  );
}

export function UsedMaterialsTable({
  reportId,
  activityId,
}: {
  reportId: number;
  activityId: number;
}) {
  const { data: materials, isLoading } = useSWR(
    `/api/activity/${activityId}/used-materials`,
    () => Actions.listSiteActivityUsedMaterials({ activityId }),
  );

  return <MaterialsTable materials={materials} isLoading={isLoading} />;
}

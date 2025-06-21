"use client";

import * as React from "react";
import * as Actions from "@/lib/actions";
import { SiteEquipment } from "@/lib/types";
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
}: {
  equipment?: SiteEquipment[];
  isLoading: boolean;
}) {
  const table = useReactTable({
    data: equipment ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const totalCostsByCurrency = React.useMemo(() => {
    const totals: Record<string, number> = {};
    (equipment ?? []).forEach((eq) => {
      const quantity = eq.quantity ?? 0;
      const cost = eq.cost ? parseFloat(eq.cost) : 0;
      const currency = eq.costUnits || "-";
      const total = quantity * cost;
      if (!totals[currency]) totals[currency] = 0;
      totals[currency] += total;
    });
    return totals;
  }, [equipment]);

  return (
    <div className="w-full h-full pl-1 flex flex-col gap-2 min-h-0 grow">
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
      <ScrollArea className="flex-1 min-h-0 rounded-md border max-w-full overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-center whitespace-nowrap"
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

  return <EquipmentTable equipment={equipment} isLoading={isLoading} />;
}

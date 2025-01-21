"use client";

import * as React from "react";
import * as Actions from "@/lib/actions";
import { SiteMaterial, SiteReport } from "@/lib/types";
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

export function MaterialsTable({ report }: { report?: SiteReport }) {
  const { data: materials } = useSWR(
    `/api/report/${report?.id}/materials`,
    () =>
      report?.id ? Actions.listSiteReportUsedMaterials(report.id) : undefined,
  );

  const table = useReactTable({
    data: materials ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full pl-1">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter material names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button
          variant="default"
          onClick={() => {
            if (!materials) return;
            if (!report) return;
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += Object.keys(materials[0]).join(",");
            csvContent += "\n";
            csvContent += materials
              .map((e) => Object.values(e).join(","))
              .join("\n");

            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute(
              "download",
              `harpapro-report-#${report.id}-${report.createdAt?.toDateString()}-materials.csv`,
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          Export CSV
        </Button>
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
            {table.getRowModel().rows?.length ? (
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

import * as Tan from "@tanstack/react-table";
import { LucideArrowDown, LucideArrowUp, LucideArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ColumnSortHeader({
  column,
  label,
}: {
  column: Tan.Column<any>;
  label: string;
}) {
  const sortedState = column.getCanSort()
    ? ((column.getIsSorted() || "nosort") as string)
    : "cannotsort";
  return (
    <div className="inline-flex items-center justify-center whitespace-nowrap gap-2 hover:cursor-pointer">
      {label}
      {
        {
          asc: <LucideArrowUp className="w-3.5 h-3.5" />,
          desc: <LucideArrowDown className="w-3.5 h-3.5" />,
          nosort: <LucideArrowUpDown className="w-3.5 h-3.5" />,
          cannotsort: null,
        }[sortedState]
      }
    </div>
  );
}

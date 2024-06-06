import { LucideArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ColumnSortButton({
  column,
  label,
}: {
  column: any;
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <LucideArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

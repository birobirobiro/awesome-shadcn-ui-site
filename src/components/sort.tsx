import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useState } from "react";

interface SortProps {
  onSort: (sortBy: "name" | "category", direction: "asc" | "desc") => void;
}

interface SortOption {
  value: "name" | "category";
  label: string;
  icon: React.ReactNode;
}

const sortOptions: SortOption[] = [
  {
    value: "name",
    label: "Name",
    icon: <ArrowUpDown className="h-4 w-4 mr-2" />,
  },
  {
    value: "category",
    label: "Category",
    icon: <ArrowUpDown className="h-4 w-4 mr-2" />,
  },
];

export default function Sort({ onSort }: SortProps) {
  const [sortState, setSortState] = useState<{
    by: "name" | "category";
    direction: "asc" | "desc";
  }>({
    by: "name",
    direction: "asc",
  });

  const handleSortChange = useCallback(
    (value: string) => {
      const [newSortBy, newDirection] = value.split("-") as [
        "name" | "category",
        "asc" | "desc",
      ];
      setSortState({ by: newSortBy, direction: newDirection });
      onSort(newSortBy, newDirection);
    },
    [onSort],
  );

  return (
    <Select
      onValueChange={handleSortChange}
      value={`${sortState.by}-${sortState.direction}`}
    >
      <SelectTrigger className="flex items-center justify-between w-[180px]">
        <SelectValue>
          {sortOptions.find((option) => option.value === sortState.by)?.label}
          {sortState.direction === "asc" ? (
            <SortAsc className="h-4 w-4 ml-2 inline" />
          ) : (
            <SortDesc className="h-4 w-4 ml-2 inline" />
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <>
            <SelectItem
              key={`${option.value}-asc`}
              value={`${option.value}-asc`}
            >
              {option.label}
              <SortAsc className="h-4 w-4 ml-2 inline" />
            </SelectItem>
            <SelectItem
              key={`${option.value}-desc`}
              value={`${option.value}-desc`}
            >
              {option.label}
              <SortDesc className="h-4 w-4 ml-2 inline" />
            </SelectItem>
          </>
        ))}
      </SelectContent>
    </Select>
  );
}

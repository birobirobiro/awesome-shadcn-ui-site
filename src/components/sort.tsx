import { ArrowUpDown, SortAsc, SortDesc } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortProps {
  sortBy: "name";
  direction: "asc" | "desc";
  onSort: (sortBy: "name", direction: "asc" | "desc") => void;
}

interface SortOption {
  value: "name";
  label: string;
  icon: React.ReactNode;
}

const sortOptions: SortOption[] = [
  {
    value: "name",
    label: "Name",
    icon: <ArrowUpDown className="h-4 w-4 mr-2" />,
  },
];

export default function Sort({ sortBy, direction, onSort }: SortProps) {
  const handleSortChange = useCallback(
    (value: string) => {
      const [, newDirection] = value.split("-") as ["name", "asc" | "desc"];
      onSort("name", newDirection);
    },
    [onSort],
  );

  const sortItems = useMemo(
    () => [
      {
        key: "name-desc",
        value: "name-desc",
        label: "Name",
        icon: <SortDesc className="h-4 w-4 ml-2 inline" />,
      },
      {
        key: "name-asc",
        value: "name-asc",
        label: "Name",
        icon: <SortAsc className="h-4 w-4 ml-2 inline" />,
      },
    ],
    [],
  );

  return (
    <Select onValueChange={handleSortChange} value={`${sortBy}-${direction}`}>
      <SelectTrigger className="flex items-center justify-between w-[180px]">
        <SelectValue>
          {sortOptions.find((option) => option.value === sortBy)?.label}
          {direction === "asc" ? (
            <SortDesc className="h-4 w-4 ml-2 inline" />
          ) : (
            <SortAsc className="h-4 w-4 ml-2 inline" />
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {sortItems.map((item) => (
          <SelectItem key={item.key} value={item.value}>
            {item.label}
            {item.icon}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

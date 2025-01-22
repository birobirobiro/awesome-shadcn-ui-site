import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortAsc, SortDesc } from "lucide-react";

import React from "react";

interface SortProps {
  direction: "asc" | "desc";
  onSort: (direction: "asc" | "desc") => void;
}

export default function Sort({ direction, onSort }: SortProps) {
  const handleSortChange = (value: string) => {
    onSort(value as "asc" | "desc");
  };

  const sortItems = [
    {
      key: "desc",
      value: "desc",
      label: "Name (Z-A)",
      icon: <SortDesc className="h-4 w-4 ml-2 inline" />,
    },
    {
      key: "asc",
      value: "asc",
      label: "Name (A-Z)",
      icon: <SortAsc className="h-4 w-4 ml-2 inline" />,
    },
  ];

  return (
    <Select
      defaultValue="asc"
      onValueChange={handleSortChange}
      value={direction}
    >
      <SelectTrigger className="flex items-center justify-between w-[180px]">
        <SelectValue>
          {direction === "asc" ? "Name (A-Z)" : "Name (Z-A)"}
          {direction === "asc" ? (
            <SortAsc className="h-4 w-4 ml-2 inline" />
          ) : (
            <SortDesc className="h-4 w-4 ml-2 inline" />
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

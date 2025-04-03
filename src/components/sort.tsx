import { Calendar, SortAsc, SortDesc, Text } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

interface SortProps {
  sortOption: string;
  onSortChange: (option: string) => void;
}

export default function Sort({ sortOption, onSortChange }: SortProps) {
  const sortItems = [
    {
      key: "date-asc",
      value: "date-asc",
      label: "Date (Oldest)",
      icon: <Calendar className="h-4 w-4 mr-2" />,
      directionIcon: <SortAsc className="h-4 w-4 ml-2 inline" />,
    },
    {
      key: "date-desc",
      value: "date-desc",
      label: "Date (Newest)",
      icon: <Calendar className="h-4 w-4 mr-2" />,
      directionIcon: <SortDesc className="h-4 w-4 ml-2 inline" />,
    },
    {
      key: "name-asc",
      value: "name-asc",
      label: "Name (A-Z)",
      icon: <Text className="h-4 w-4 mr-2" />,
      directionIcon: <SortAsc className="h-4 w-4 ml-2 inline" />,
    },
    {
      key: "name-desc",
      value: "name-desc",
      label: "Name (Z-A)",
      icon: <Text className="h-4 w-4 mr-2" />,
      directionIcon: <SortDesc className="h-4 w-4 ml-2 inline" />,
    },
  ];

  const selectedItem =
    sortItems.find((item) => item.value === sortOption) || sortItems[0];

  return (
    <Select value={sortOption} onValueChange={onSortChange}>
      <SelectTrigger className="flex items-center justify-between w-[180px]">
        <SelectValue>
          <span className="flex items-center">
            {selectedItem.icon}
            {selectedItem.label}
            {selectedItem.directionIcon}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {sortItems.map((item) => (
          <SelectItem key={item.key} value={item.value}>
            <span className="flex items-center">
              {item.icon}
              {item.label}
              {item.directionIcon}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

import React, { useCallback } from "react";

import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import Sort from "@/components/sort";
import { motion } from "framer-motion";

interface SearchFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryOptions: { label: string; value: string }[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  sortBy: "name";
  sortDirection: "asc" | "desc";
  handleSortChange: (sortBy: "name", direction: "asc" | "desc") => void;
}

export function SearchFilterControls({
  searchQuery,
  setSearchQuery,
  categoryOptions,
  selectedCategories,
  setSelectedCategories,
  sortBy,
  sortDirection,
  handleSortChange,
}: SearchFilterControlsProps) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery],
  );

  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-between items-center gap-4"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delay: 0.2,
          },
        },
      }}
    >
      <Input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full sm:w-64"
      />
      <div className="w-full sm:w-auto flex flex-row items-center gap-4">
        <MultiSelect
          options={categoryOptions}
          value={selectedCategories}
          onValueChange={setSelectedCategories}
          placeholder="Filter by category"
          className="w-full sm:w-64"
        />
        <Sort
          sortBy={sortBy}
          direction={sortDirection}
          onSort={handleSortChange}
        />
      </div>
    </motion.div>
  );
}

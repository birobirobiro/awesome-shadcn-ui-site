import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import Sort from "@/components/sort";
import { motion } from "framer-motion";

interface SearchFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryOptions: { label: string; value: string }[];
  setSelectedCategories: (categories: string[]) => void;
  handleSortChange: (
    sortBy: "name" | "category",
    direction: "asc" | "desc",
  ) => void;
}

export function SearchFilterControls({
  searchQuery,
  setSearchQuery,
  categoryOptions,
  setSelectedCategories,
  handleSortChange,
}: SearchFilterControlsProps) {
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
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full sm:w-64"
      />
      <div className="w-full sm:w-auto flex flex-row items-center gap-4">
        <MultiSelect
          options={categoryOptions}
          onValueChange={setSelectedCategories}
          placeholder="Filter by category"
          className="w-full sm:w-64"
        />
        <Sort onSort={handleSortChange} />
      </div>
    </motion.div>
  );
}

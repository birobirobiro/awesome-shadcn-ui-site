"use client";

import { useAnimation, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ItemGrid } from "../item-grid";
import { PaginationControls } from "../pagination-controls";
import { SearchFilterControls } from "../search-filter-controls";
import { motion } from "framer-motion";
import { useDebounce } from "@/hooks/use-debounce";

const ITEMS_PER_PAGE_OPTIONS = [18, 27, 36, 45];

interface Item {
  id: number;
  name: string;
  description: string;
  url: string;
  category: string;
}

interface Category {
  title: string;
  items: Item[];
}

interface ItemListProps {
  items: Item[];
  categories: Category[];
}

export default function ItemList({
  items: initialItems,
  categories,
}: ItemListProps) {
  const [filteredItems, setFilteredItems] = useState<Item[]>(initialItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "category">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [direction, setDirection] = useState(0);

  const controls = useAnimation();
  const shouldReduceMotion = useReducedMotion();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.title,
        value: category.title,
      })),
    [categories],
  );

  const filterAndSortItems = useCallback(() => {
    let filtered = initialItems;

    if (debouncedSearchQuery) {
      const lowercaseQuery = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(lowercaseQuery) ||
          item.description.toLowerCase().includes(lowercaseQuery),
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category),
      );
    }

    filtered.sort((a, b) => {
      const compareResult =
        sortBy === "name"
          ? (a.name || "").localeCompare(b.name || "")
          : (a.category || "").localeCompare(b.category || "");
      return sortDirection === "asc" ? compareResult : -compareResult;
    });

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [
    initialItems,
    debouncedSearchQuery,
    selectedCategories,
    sortBy,
    sortDirection,
  ]);

  useEffect(() => {
    filterAndSortItems();
  }, [filterAndSortItems]);

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      setDirection(pageNumber > currentPage ? 1 : -1);
      setCurrentPage(pageNumber);
    },
    [currentPage],
  );

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback(
    (newSortBy: "name" | "category", newDirection: "asc" | "desc") => {
      setSortBy(newSortBy);
      setSortDirection(newDirection);
    },
    [],
  );

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate={controls}
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
      <SearchFilterControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryOptions={categoryOptions}
        setSelectedCategories={setSelectedCategories}
        handleSortChange={handleSortChange}
      />

      <ItemGrid items={currentItems} direction={direction} />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
        handleItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
      />

      <motion.div
        className="text-sm text-muted-foreground text-center"
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
        Showing {indexOfFirstItem + 1} -{" "}
        {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
        {filteredItems.length} items
      </motion.div>
    </motion.div>
  );
}

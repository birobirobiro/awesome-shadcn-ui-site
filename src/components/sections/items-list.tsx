"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isValid, parseISO } from "date-fns";

import { ItemGrid } from "../item-grid";
import { PaginationControls } from "../pagination-controls";
import { Resource } from "@/hooks/use-readme";
import { SearchFilterControls } from "../search-filter-controls";
import { Skeleton } from "../ui/skeleton";
import { useBookmarks } from "@/hooks/use-bookmark";
import { useDebounce } from "@/hooks/use-debounce";

const ITEMS_PER_PAGE_OPTIONS = [18, 27, 36, 45];

interface Category {
  title: string;
  items: Resource[];
}

interface ItemListProps {
  items: Resource[];
  categories: Category[];
}

export default function ItemList({
  items: initialItems,
  categories,
}: ItemListProps) {
  const [filteredItems, setFilteredItems] = useState<Resource[]>(initialItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("date-desc");
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { bookmarkedItems, toggleBookmark } = useBookmarks();

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
      const aBookmarked = bookmarkedItems.includes(a.id);
      const bBookmarked = bookmarkedItems.includes(b.id);
      if (aBookmarked !== bBookmarked) return aBookmarked ? -1 : 1;

      // Parse the sort option
      const [field, direction] = sortOption.split("-");

      if (field === "name") {
        const compareResult = (a.name || "").localeCompare(b.name || "");
        return direction === "asc" ? compareResult : -compareResult;
      } else {
        // Sort by date
        const dateA =
          a.date && a.date !== "Unknown" ? parseISO(a.date) : new Date(0);
        const dateB =
          b.date && b.date !== "Unknown" ? parseISO(b.date) : new Date(0);

        if (!isValid(dateA)) return direction === "asc" ? -1 : 1;
        if (!isValid(dateB)) return direction === "asc" ? 1 : -1;

        return direction === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
    });

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [
    initialItems,
    debouncedSearchQuery,
    selectedCategories,
    sortOption,
    bookmarkedItems,
  ]);

  useEffect(() => {
    filterAndSortItems();
  }, [filterAndSortItems]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((option: string) => {
    setSortOption(option);
  }, []);

  return (
    <div className="space-y-6">
      <SearchFilterControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryOptions={categoryOptions}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        sortOption={sortOption}
        onSortChange={handleSortChange}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={isLoading ? "loading" : "loaded"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(itemsPerPage)].map((_, index) => (
                <Card
                  key={index}
                  className="flex flex-col h-full min-h-[250px] overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <ItemGrid
              items={currentItems}
              bookmarkedItems={bookmarkedItems}
              onBookmark={toggleBookmark}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
        handleItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
      />

      <div className="text-sm text-muted-foreground text-center">
        Showing {indexOfFirstItem + 1} -{" "}
        {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
        {filteredItems.length} items
      </div>
    </div>
  );
}

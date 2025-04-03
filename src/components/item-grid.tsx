import { AnimatePresence, motion } from "framer-motion";

import ItemCard from "./item-card";
import React from "react";
import { Resource } from "@/hooks/use-readme";

interface ItemGridProps {
  items: Resource[];
  bookmarkedItems: number[];
  onBookmark: (id: number) => void;
}

export function ItemGrid({
  items,
  bookmarkedItems,
  onBookmark,
}: ItemGridProps) {
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-12"
      >
        <p className="text-muted-foreground">
          No items found matching your criteria.
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" layout>
        {items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            title={item.name}
            description={item.description}
            url={item.url}
            category={item.category}
            date={item.date}
            isBookmarked={bookmarkedItems.includes(item.id)}
            onBookmark={onBookmark}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

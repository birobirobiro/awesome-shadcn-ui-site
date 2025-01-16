import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo } from "react";

import ItemCard from "@/components/item-card";

interface Item {
  id: number;
  name: string;
  description: string;
  url: string;
  category: string;
}

interface ItemGridProps {
  items: Item[];
  bookmarkedItems: number[];
  onBookmark: (id: number) => void;
}

export function ItemGrid({
  items,
  bookmarkedItems,
  onBookmark,
}: ItemGridProps) {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aBookmarked = bookmarkedItems.includes(a.id);
      const bBookmarked = bookmarkedItems.includes(b.id);
      if (aBookmarked === bBookmarked) return 0;
      return aBookmarked ? -1 : 1;
    });
  }, [items, bookmarkedItems]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence initial={false}>
        {sortedItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <ItemCard
              id={item.id}
              title={item.name}
              description={item.description}
              url={item.url}
              category={item.category}
              isBookmarked={bookmarkedItems.includes(item.id)}
              onBookmark={onBookmark}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

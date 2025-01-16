import { AnimatePresence, motion } from "framer-motion";

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
  direction: number;
}

export function ItemGrid({ items, direction }: ItemGridProps) {
  const containerVariants = {
    hidden: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 20 : -20,
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -20 : 20,
      transition: {
        staggerChildren: 0.05,
      },
    }),
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={items.length}
        custom={direction}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((item, index) => (
          <motion.div key={item.id + "-" + index} variants={itemVariants}>
            <ItemCard
              title={item.name}
              description={item.description}
              url={item.url}
              category={item.category}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

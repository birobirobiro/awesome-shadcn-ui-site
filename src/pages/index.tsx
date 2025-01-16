"use client";

import React, { useEffect, useState } from "react";
import { Resource, fetchAndParseReadme } from "@/hooks/use-readme";

import Hero from "@/components/sections/hero";
import ItemList from "@/components/sections/items-list";
import { SubmitCTA } from "@/components/sections/cta-submit";
import { motion } from "framer-motion";

interface Category {
  title: string;
  items: Resource[];
}

const EXCLUDED_CATEGORIES = ["Star History", "Contributors"];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredItems, setFilteredItems] = useState<Resource[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedResources = await fetchAndParseReadme();
        const groupedCategories = fetchedResources.reduce(
          (acc, resource) => {
            if (!EXCLUDED_CATEGORIES.includes(resource.category)) {
              if (!acc[resource.category]) {
                acc[resource.category] = [];
              }
              acc[resource.category].push(resource);
            }
            return acc;
          },
          {} as Record<string, Resource[]>,
        );

        const formattedCategories = Object.entries(groupedCategories).map(
          ([title, items]) => ({
            title,
            items,
          }),
        );

        setCategories(formattedCategories);
        setFilteredItems(
          fetchedResources.filter(
            (item) => !EXCLUDED_CATEGORIES.includes(item.category),
          ),
        );
      } catch (error) {
        console.error("Error fetching README:", error);
      }
    }

    fetchData();
  }, []);

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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Hero />
      </motion.div>

      <motion.div variants={itemVariants} className="my-12">
        <ItemList items={filteredItems} categories={categories} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SubmitCTA />
      </motion.div>
    </motion.div>
  );
}

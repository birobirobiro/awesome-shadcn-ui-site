"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Hero() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-4 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <img
          src="/logo.svg"
          alt="awesome-shadcn/ui logo"
          className="max-h-36"
        />
      </motion.div>
      <motion.h1
        className="text-4xl font-bold tracking-tighter sm:text-5xl"
        variants={itemVariants}
      >
        awesome-shadcn/ui
      </motion.h1>
      <motion.p
        className="max-w-[900px] text-muted-foreground"
        variants={itemVariants}
      >
        A curated list of awesome things related to{" "}
        <a
          href="https://ui.shadcn.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          shadcn/ui
        </a>
      </motion.p>
      <motion.p
        className="text-sm text-muted-foreground"
        variants={itemVariants}
      >
        Created by:{" "}
        <a
          href="https://birobirobiro.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          birobirobiro.dev
        </a>
      </motion.p>
    </motion.div>
  );
}

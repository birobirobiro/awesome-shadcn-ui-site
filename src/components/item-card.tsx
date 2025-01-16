import { Bookmark, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
import { motion } from "framer-motion";

interface ItemCardProps {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  isBookmarked: boolean;
  onBookmark: (id: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  title,
  description,
  url,
  category,
  isBookmarked,
  onBookmark,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="flex flex-col h-full min-h-[250px] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold line-clamp-2">
              {title}
            </CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="pt-4 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onBookmark(id)}
            className={`transition-colors flex-shrink-0 ${
              isBookmarked
                ? "text-yellow-500 hover:text-yellow-600 border-yellow-600"
                : "text-gray-400 hover:text-gray-500"
            }`}
          >
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button asChild className="w-full group" variant="outline">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              View Resource
              <ExternalLink className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ItemCard;

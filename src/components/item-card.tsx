import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface ItemCardProps {
  title: string;
  description: string;
  url: string;
  category: string;
}

export default function ItemCard({
  title,
  description,
  url,
  category,
}: ItemCardProps) {
  return (
    <motion.div transition={{ type: "spring", stiffness: 300, damping: 10 }}>
      <Card className="flex flex-col h-full min-h-[250px] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold line-clamp-2">
              {title}
            </CardTitle>
            <Badge variant="secondary" className="ml-2 shrink-0">
              {category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="pt-4">
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
}

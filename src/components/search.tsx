"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AwesomeItem } from "@/types/awesome-list";

export function Search({ items }: { items: AwesomeItem[] }) {
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [search, items]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <SearchIcon className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {search && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.name}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

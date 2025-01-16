import { useCallback, useEffect, useState } from "react";

export function useBookmarks() {
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([]);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarkedItems");
    if (storedBookmarks) {
      setBookmarkedItems(JSON.parse(storedBookmarks));
    }
  }, []);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarkedItems((prevBookmarks) => {
      const newBookmarks = prevBookmarks.includes(id)
        ? prevBookmarks.filter((bookmarkId) => bookmarkId !== id)
        : [...prevBookmarks, id];

      localStorage.setItem("bookmarkedItems", JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  }, []);

  return { bookmarkedItems, toggleBookmark };
}

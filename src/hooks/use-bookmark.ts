import { useCallback, useEffect, useRef, useState } from "react";

export function useBookmarks() {
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastClickedRef = useRef<{ id: number; timestamp: number } | null>(null);

  const isLocalStorageAvailable = useCallback(() => {
    try {
      const test = "__localStorage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const loadBookmarks = () => {
      try {
        setError(null);

        if (!isLocalStorageAvailable()) {
          setBookmarkedItems([]);
          setIsLoading(false);
          return;
        }

        const storedBookmarks = localStorage.getItem("bookmarkedItems");
        if (!storedBookmarks) {
          setBookmarkedItems([]);
          setIsLoading(false);
          return;
        }

        const parsed = JSON.parse(storedBookmarks);

        if (
          Array.isArray(parsed) &&
          parsed.every((item) => typeof item === "number")
        ) {
          setBookmarkedItems(parsed);
        } else {
          setBookmarkedItems([]);
          localStorage.removeItem("bookmarkedItems");
        }
      } catch (err) {
        setError("Failed to load bookmarks");
        setBookmarkedItems([]);
        try {
          localStorage.removeItem("bookmarkedItems");
        } catch {}
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarks();
  }, [isLocalStorageAvailable]);

  const toggleBookmark = useCallback(
    (id: number) => {
      if (isLoading) return;

      const now = Date.now();
      if (
        lastClickedRef.current &&
        lastClickedRef.current.id === id &&
        now - lastClickedRef.current.timestamp < 300
      ) {
        return;
      }
      lastClickedRef.current = { id, timestamp: now };

      setBookmarkedItems((prevBookmarks) => {
        const isCurrentlyBookmarked = prevBookmarks.includes(id);
        const newBookmarks = isCurrentlyBookmarked
          ? prevBookmarks.filter((bookmarkId) => bookmarkId !== id)
          : [...prevBookmarks, id];

        try {
          if (isLocalStorageAvailable()) {
            localStorage.setItem(
              "bookmarkedItems",
              JSON.stringify(newBookmarks),
            );
          }
        } catch (err) {
          setError("Failed to save bookmark");
          return prevBookmarks;
        }

        setError(null);
        return newBookmarks;
      });
    },
    [isLoading, isLocalStorageAvailable],
  );

  const clearBookmarks = useCallback(() => {
    setBookmarkedItems([]);
    try {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem("bookmarkedItems");
      }
    } catch (err) {
      setError("Failed to clear bookmarks");
    }
  }, [isLocalStorageAvailable]);

  const isBookmarked = useCallback(
    (id: number) => {
      return bookmarkedItems.includes(id);
    },
    [bookmarkedItems],
  );

  return {
    bookmarkedItems,
    toggleBookmark,
    clearBookmarks,
    isBookmarked,
    isLoading,
    error,
  };
}

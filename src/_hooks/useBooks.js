import { useEffect, useState } from "react";
import { getBooks } from "../_services/books";

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData] = await Promise.all([
          getBooks(),
        ])

        setBooks(booksData)
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData()
  }, [])
  
  return { books, setBooks, loading };
}
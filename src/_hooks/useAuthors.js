import { useEffect, useState } from "react";
import { getAuthors } from "../_services/authors";

export function useAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsData] = await Promise.all([getAuthors()]);
        setAuthors(authorsData);
      } catch (error) {
        console.error("Failed to fetch authors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [])
  
  const getAuthorName = (id) => {
    const author = authors.find((a) => a.id === id);
    return author ? author.name : "Unknown Author";
  };

  return { authors, loading, getAuthorName };
}
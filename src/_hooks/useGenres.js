import { useEffect, useState } from "react";
import { getGenres } from "../_services/genres";

export function useGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresData] = await Promise.all([getGenres()]);
        setGenres(genresData);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData()
  }, []);

  // fungsi helper kecil untuk mencari nama genre berdasarkan ID
  const getGenreName = (id) => {
    const genre = genres.find((g) => g.id === id);
    return genre ? genre.name : "Unknown Genre";
  };
  
  return { genres, loading, getGenreName };
}

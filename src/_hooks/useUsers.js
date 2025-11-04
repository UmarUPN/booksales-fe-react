import { useEffect, useState } from "react";
import { getUsers } from "../_services/users";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData] = await Promise.all([
          getUsers(),
        ])

        setUsers(usersData)
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData()
  }, [])
  
  return { users, setUsers, loading };
}
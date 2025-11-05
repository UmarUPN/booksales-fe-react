import { useTransactions } from "./useTransactions";
import { useUsers } from "./useUsers";
import { useState, useEffect } from "react";

export const useAdminDashboard = () => {
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { users, loading: usersLoading } = useUsers();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!transactionsLoading && !usersLoading) {
      calculateDashboardStats();
      setLoading(false);
    }
  }, [transactions, users, transactionsLoading, usersLoading]);

  const calculateDashboardStats = () => {
    // Hitung total customers
    const totalCustomers = users.filter(user => user.role === 'customer').length;

    // Dapatkan saldo admin (user dengan ID 1)
    const admin = users.find(user => user.id === 1);
    const adminBalance = admin?.balance || 0;

    // Hitung total transaksi
    const totalTransactions = transactions.length;

    // Hitung transaksi berdasarkan status
    const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
    const paidTransactions = transactions.filter(t => t.status === 'paid').length;
    const cancelledTransactions = transactions.filter(t => t.status === 'cancelled').length;

    // Ambil 10 transaksi terbaru
    const sortedTransactions = [...transactions]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);

    // Format data untuk recent transactions dengan informasi user
    const formattedRecentTransactions = sortedTransactions.map(transaction => {
      const user = users.find(u => u.id === transaction.user_id);
      return {
        ...transaction,
        user: user ? { name: user.name } : { name: 'Unknown User' }
      };
    });

    setDashboardStats({
      totalCustomers,
      adminBalance,
      totalTransactions,
      pendingTransactions,
      paidTransactions,
      cancelledTransactions
    });

    setRecentTransactions(formattedRecentTransactions);
  };

  return {
    dashboardStats,
    recentTransactions,
    loading: loading || transactionsLoading || usersLoading,
    refresh: calculateDashboardStats
  };
};
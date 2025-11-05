import { useState } from "react";
import { toast } from "react-toastify";
import { deleteTransaction, getTransactionDetail, updateTransactionStatus } from "../../../_services/transactions";
import { useTransactions } from "../../../_hooks/useTransactions";
import { formatCurrencyWithDecimal } from "../../../_utils/formatCurrency";

export default function AdminTransactions() {
  const { transactions, loading, setTransactions } = useTransactions();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingTransaction, setUpdatingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  const filteredTransactions = transactions.filter(transaction => 
    selectedStatus === "all" || transaction.status === selectedStatus
  );

  const handleUpdateStatus = async (transactionId, newStatus) => {
    setUpdatingTransaction(transactionId);
    try {
      await updateTransactionStatus(transactionId, newStatus);
      toast.success(`Transaction status updated to ${newStatus}!`);
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === transactionId
            ? { ...transaction, status: newStatus }
            : transaction
        )
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
    } finally {
      setUpdatingTransaction(null);
    }
  };

  const handleDelete = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    setDeletingTransaction(transactionId);
    try {
      await deleteTransaction(transactionId);
      toast.success("Transaction deleted successfully!");
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== transactionId)
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    } finally {
      setDeletingTransaction(null);
    }
  };

  const handleViewDetails = async (transactionId) => {
    try {
      const transaction = await getTransactionDetail(transactionId);
      setSelectedTransaction(transaction);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      toast.error("Failed to load transaction details");
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                All Transactions
              </h1>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full md:w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">Transaction Code</th>
                  <th scope="col" className="px-4 py-3">User</th>
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-4 py-3">Total Amount</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b dark:border-gray-700">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {transaction.transaction_code}
                      </th>
                      <td className="px-4 py-3">
                        {transaction.user?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {formatCurrencyWithDecimal(transaction.total_amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[transaction.status]}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(transaction.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleUpdateStatus(transaction.id, 'paid')}
                          disabled={updatingTransaction === transaction.id || transaction.status === 'paid'}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                          title="Mark as Paid"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleUpdateStatus(transaction.id, 'pending')}
                          disabled={updatingTransaction === transaction.id || transaction.status === 'pending'}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 disabled:opacity-50"
                          title="Mark as Pending"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleUpdateStatus(transaction.id, 'cancelled')}
                          disabled={updatingTransaction === transaction.id || transaction.status === 'cancelled'}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                          title="Cancel Transaction"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          disabled={deletingTransaction === transaction.id}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                          title="Delete Transaction"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b dark:border-gray-700">
                    <td colSpan="6" className="px-4 py-3 text-center font-medium text-gray-900 dark:text-white">
                      {selectedStatus === "all" ? "No transactions found." : `No ${selectedStatus} transactions found.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Transaction Detail Modal (sama seperti di customer page) */}
      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Transaction Details
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Transaction Code</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.transaction_code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">User</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedTransaction.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedTransaction.status]}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrencyWithDecimal(selectedTransaction.total_amount)}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Items</h4>
                <div className="space-y-3">
                  {selectedTransaction.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.book_title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">by {item.author_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">{formatCurrencyWithDecimal(item.price)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
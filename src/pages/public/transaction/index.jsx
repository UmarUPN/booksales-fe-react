import { useState } from "react";
import { toast } from "react-toastify";
import { useTransactions } from "../../../_hooks/useTransactions";
import { updateTransactionStatus } from "../../../_services/transactions";
import { formatCurrencyWithDecimal } from "../../../_utils/formatCurrency";
import { Link } from "react-router-dom";

export default function Transactions() {
  const { transactions, loading, setTransactions } = useTransactions();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [updatingTransaction, setUpdatingTransaction] = useState(null);
  const [processingTransaction, setProcessingTransaction] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  // Filter transactions based on selected status
  const filteredTransactionsStatus = transactions.filter(
    (transaction) =>
      selectedStatus === "all" || transaction.status === selectedStatus
  );

  const filteredTransactions = filteredTransactionsStatus.filter(
    (transaction) => transaction.user_id === userInfo.id
  );

  const handleUpdateStatus = async (transactionId, newStatus) => {
    setUpdatingTransaction(transactionId);
    try {
      await updateTransactionStatus(transactionId, newStatus);
      toast.success(`Transaction ${newStatus} successfully!`);
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === transactionId
            ? { ...transaction, status: newStatus }
            : transaction
        )
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update transaction";

      toast.error(message);
    } finally {
      setUpdatingTransaction(null);
      setIsPaymentModalOpen(false);
      setIsCancelModalOpen(false);
    }
  };

  const handlePayClick = (transaction) => {
    setProcessingTransaction(transaction);
    setIsPaymentModalOpen(true);
  };

  const handleCancelClick = (transaction) => {
    setProcessingTransaction(transaction);
    setIsCancelModalOpen(true);
  };

  const statusColors = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Transaction History
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
                  <th scope="col" className="px-4 py-3">
                    Transaction Code
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Total Amount
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {transaction.transaction_code}
                      </th>
                      <td className="px-4 py-3">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {formatCurrencyWithDecimal(transaction.total_amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[transaction.status]
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex items-center justify-end space-x-2">
                        <Link
                          to={`/transactions/show/${transaction.id}`}
                          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                          Details
                        </Link>

                        {transaction.status === "pending" && (
                          <>
                            <button
                              onClick={() => handlePayClick(transaction)}
                              disabled={updatingTransaction === transaction.id}
                              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Pay
                            </button>

                            <button
                              onClick={() => handleCancelClick(transaction)}
                              disabled={updatingTransaction === transaction.id}
                              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b dark:border-gray-700">
                    <td
                      colSpan="5"
                      className="px-4 py-3 text-center font-medium text-gray-900 dark:text-white"
                    >
                      {selectedStatus === "all"
                        ? "No transactions found."
                        : `No ${selectedStatus} transactions found.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Payment Confirmation Modal */}
      {isPaymentModalOpen && processingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Payment Confirmation
                </h3>
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Transaction Code
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {processingTransaction.transaction_code}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Amount
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    {formatCurrencyWithDecimal(processingTransaction.total_amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your Balance
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrencyWithDecimal(userInfo.balance || 0)}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus(processingTransaction.id, "paid")}
                  disabled={updatingTransaction === processingTransaction.id}
                  className="flex-1 px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingTransaction === processingTransaction.id ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && processingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Cancel Transaction
                </h3>
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Transaction Code
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {processingTransaction.transaction_code}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Amount
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrencyWithDecimal(processingTransaction.total_amount)}
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 dark:bg-yellow-900 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Are you sure you want to cancel this transaction? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  No, Keep It
                </button>
                <button
                  onClick={() => handleUpdateStatus(processingTransaction.id, "cancelled")}
                  disabled={updatingTransaction === processingTransaction.id}
                  className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingTransaction === processingTransaction.id ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
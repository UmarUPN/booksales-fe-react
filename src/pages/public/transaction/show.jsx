// show.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTransactionDetail, updateTransactionStatus } from "../../../_services/transactions";
import { formatCurrencyWithDecimal } from "../../../_utils/formatCurrency";
import { toast } from "react-toastify";

export default function TransactionShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "pay" or "cancel"
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const transactionData = await getTransactionDetail(id);
        setTransaction(transactionData);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
        toast.error("Failed to load transaction details");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleUpdateStatus = async (transactionId, newStatus) => {
    setUpdating(true);
    try {
      await updateTransactionStatus(transactionId, newStatus);
      toast.success(`Transaction ${newStatus} successfully!`);
      
      // Update transaction status locally
      setTransaction(prev => ({
        ...prev,
        status: newStatus
      }));
      
      // Close modal
      setIsModalOpen(false);
      setModalType("");
      
      // Navigate back to transactions list after a short delay
      setTimeout(() => {
        navigate('/transactions');
      }, 1500);
      
    } catch (error) {
      console.error("Error updating transaction:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update transaction";
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Transaction not found</p>
        <Link
          to="/transactions"
          className="ml-4 px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Transactions
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Transaction Details
              </h1>
              <Link
                to="/transactions"
                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Back to Transactions
              </Link>
            </div>
          </div>

          <div className="p-6">
            {/* Transaction Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Transaction Code
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {transaction.transaction_code}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Date
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(transaction.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      statusColors[transaction.status]
                    }`}
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Amount
                  </label>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrencyWithDecimal(transaction.total_amount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Items */}
            <div className="border-t dark:border-gray-700 pt-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Transaction Items
              </h3>
              <div className="space-y-4">
                {transaction.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {item.book_title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          by {item.author_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrencyWithDecimal(item.price)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-md font-medium text-gray-900 dark:text-white mt-1">
                        Subtotal: {formatCurrencyWithDecimal(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {transaction.status === "pending" && (
              <div className="border-t dark:border-gray-700 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Actions
                </h3>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Your Balance: {formatCurrencyWithDecimal(userInfo?.balance || 0)}
                </h4>
                <div className="flex space-x-3">
                  <button
                    onClick={() => openModal("pay")}
                    className="px-6 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Pay Now
                  </button>
                  <button
                    onClick={() => openModal("cancel")}
                    className="px-6 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Cancel Transaction
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {modalType === "pay" ? "Payment Confirmation" : "Cancel Transaction"}
                </h3>
                <button
                  onClick={closeModal}
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
                    {transaction.transaction_code}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Amount
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    {formatCurrencyWithDecimal(transaction.total_amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your Balance
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrencyWithDecimal(userInfo?.balance || 0)}
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 dark:bg-yellow-900 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    {modalType === "pay"
                      ? "Are you sure you want to pay for this transaction?"
                      : "Are you sure you want to cancel this transaction? This action cannot be undone."
                    }
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {modalType === "pay" ? "Cancel" : "No, Keep It"}
                </button>
                <button
                  onClick={() => handleUpdateStatus(transaction.id, modalType === "pay" ? "paid" : "cancelled")}
                  disabled={updating}
                  className={`flex-1 px-4 py-2 text-sm text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    modalType === "pay" 
                      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" 
                      : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  }`}
                >
                  {updating
                    ? (modalType === "pay" ? "Processing..." : "Cancelling...")
                    : (modalType === "pay" ? "Confirm Payment" : "Yes, Cancel")
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
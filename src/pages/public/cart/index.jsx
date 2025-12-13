import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthors } from "../../../_hooks/useAuthors";
import { toast } from "react-toastify";
import { deleteCartItem, updateCartItem } from "../../../_services/cart_items";
import { createTransaction } from "../../../_services/transactions";
import { useCartItems } from "../../../_hooks/useCartItems";
import { useBooks } from "../../../_hooks/useBooks";
import { ImageStorage } from "../../../_api";
import { formatCurrencyWithDecimal } from "../../../_utils/formatCurrency";

export default function Cart() {
  // const [cartItems, setCartItems] = useState([]);
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);
  const { books } = useBooks();
  const { getAuthorName } = useAuthors();
  const { cartItems, setCartItems, loading } = useCartItems();

  // useEffect(() => {
  //   fetchCartItems();
  // }, []);

  // const fetchCartItems = async () => {
  //   try {
  //     const items = await getCartItems();
  //     setCartItems(items);
  //   } catch (error) {
  //     console.error("Error fetching cart items:", error);
  //     toast.error("Failed to load cart items");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItem(cartItemId);
    try {
      await updateCartItem(cartItemId, { quantity: newQuantity });
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success("Cart updated successfully");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    if (!window.confirm("Are you sure you want to remove this item from cart?"))
      return;

    try {
      await deleteCartItem(cartItemId);
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const getBookDetails = (bookId) => {
    return books.find((book) => book.id === bookId);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const book = getBookDetails(item.book_id);
      return total + (book ? book.price * item.quantity : 0);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const handleCheckout = async () => {
    if (!localStorage.getItem("accessToken")) {
      toast.error("Please login to checkout");
      return;
    }

    setCheckoutLoading(true);
    try {
      const transaction = await createTransaction();
      toast.success(`Order ${transaction.transaction_code} created successfully! Please complete your payment.`);
      navigate("/transactions/show/" + transaction.id);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.message || "Failed to create order");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading cart...</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            Shopping Cart
          </h1>
          <Link
            to="/books"
            className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Continue Shopping
          </Link>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4"> {/* space-y-4 jrk vertikal antar elemen */}
                {cartItems.map((item) => {
                  const book = getBookDetails(item.book_id);
                  if (!book) return null;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    >
                      <img
                        src={
                          book.cover_photo
                            ? `${ImageStorage}/books/${book.cover_photo}`
                            : `${ImageStorage}/book-cover-placeholder.png`
                        }
                        alt={book.title}
                        className="w-20 h-24 object-cover rounded"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {book.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          by {getAuthorName(book.author_id)}
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                          {formatCurrencyWithDecimal(book.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg dark:border-gray-600">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={
                              item.quantity <= 1 || updatingItem === item.id
                            }
                            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 dark:text-gray-400 dark:hover:text-white cursor-pointer"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20 12H4"
                              ></path>
                            </svg>
                          </button>

                          <span className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white min-w-[40px] text-center">
                            {updatingItem === item.id ? (
                              <svg
                                className="animate-spin h-4 w-4 mx-auto text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              item.quantity
                            )}
                          </span>

                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={updatingItem === item.id}
                            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 dark:text-gray-400 dark:hover:text-white cursor-pointer"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                              ></path>
                            </svg>
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formatCurrencyWithDecimal(calculateSubtotal())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Shipping
                    </span>
                    <span className="text-gray-900 dark:text-white">Free</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {formatCurrencyWithDecimal(calculateTotal())}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading || cartItems.length === 0}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {checkoutLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  Free shipping on all orders. Taxes calculated at checkout.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="w-24 h-24 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start adding some books to your cart!
            </p>
            <Link
              to="/books"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Browse Books
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

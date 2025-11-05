import { useParams } from "react-router-dom";
import { useGenres } from "../../../_hooks/useGenres";
import { useAuthors } from "../../../_hooks/useAuthors";
import { useEffect, useState } from "react";
import { showBook } from "../../../_services/books";
import { ImageStorage } from "../../../_api";
import { formatCurrencyWithDecimal } from "../../../_utils/formatCurrency";
import { toast } from "react-toastify";
import { createCartItem } from "../../../_services/cart_items";

export default function ShowBook() {
  const { id } = useParams()

  const { getGenreName, loading:loadingGenres } = useGenres();
  const { getAuthorName, loading:loadingAuthors } = useAuthors();
  const [book, setBook] = useState([])
  const [isAddingToCart, setIsAddingToCart] = useState(null);
  
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookData] = await Promise.all([showBook(id)]);

        setBook(bookData)
      } catch (error) {
        console.error("Failed to fetch book:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [id])
  
  const handleAddToCart = async (bookId) => {
    if (!localStorage.getItem("accessToken")) {
      toast.error("Please login to add items to cart");
      return;
    }

    setIsAddingToCart(bookId);
    try {
      await createCartItem({
        book_id: bookId,
        quantity: 1,
      });
      toast.success("Book added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add book to cart");
    } finally {
      setIsAddingToCart(null);
    }
  };

  const loading = loadingAuthors || loadingGenres || loadingData;
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
              <img
                className="w-full dark:hidden"
                src={
                  book.cover_photo
                  ? `${ImageStorage}/books/${book.cover_photo}`
                  : `${ImageStorage}/book-cover-placeholder.png`
                }
                alt="Book cover"
              />
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                {book.title}
              </h1>
              
              <div className="mt-2">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Author:</span> {getAuthorName(book.author_id)}
                </p>
              </div>

              <div className="mt-1">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Genre:</span> {getGenreName(book.genre_id)}
                </p>
              </div>

              <div className="mt-4 sm:items-center sm:gap-4 sm:flex justify-between">
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                  {formatCurrencyWithDecimal(book.price)}
                </p>

                <div className="mt-2 sm:mt-0">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Stock:</span> {book.stock}
                  </p>
                </div>
              </div>

              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                <button
                  onClick={() => handleAddToCart(book.id)}
                  disabled={
                    isAddingToCart === book.id || book.stock === 0
                  }
                  className="inline-flex items-center justify-center px-3 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-400 dark:hover:bg-indigo-500 dark:focus:ring-indigo-700"
                >
                  {isAddingToCart === book.id ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Adding...
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              </div>

              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

              <p className="mb-6 text-gray-500 dark:text-gray-400">
                {book.description}
              </p>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

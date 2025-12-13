import { Link } from "react-router-dom";
import { ImageStorage } from "../../../_api";
import { useState } from "react";
import { toast } from "react-toastify";
import { createCartItem } from "../../../_services/cart_items";
import { useAuthors } from "../../../_hooks/useAuthors";
import { useGenres } from "../../../_hooks/useGenres";
import { useBooks } from "../../../_hooks/useBooks";
import { formatCurrency } from "../../../_utils/formatCurrency";

export default function Books() {
  const { getAuthorName, loading: loadingAuthors } = useAuthors();
  const { getGenreName, loading: loadingGenres } = useGenres();
  const { books, loading: loadingBooks } = useBooks();

  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(8);
  const [isAddingToCart, setIsAddingToCart] = useState(null);

  const loading = loadingAuthors || loadingGenres || loadingBooks;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  // Filter books based on search term
  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getAuthorName(book.author_id)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getGenreName(book.genre_id)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Books to display (for load more functionality)
  const booksToDisplay = filteredBooks.slice(0, displayCount);
  const hasMoreBooks = displayCount < filteredBooks.length;

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

  const loadMore = () => {
    setDisplayCount((prev) => prev + 8);
  };

  return (
    <>
      <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative mx-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search books, authors, or genres..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setDisplayCount(8);
                }}
              />
            </div>
          </div>

          {booksToDisplay.length > 0 ? (
            <>
              <div className="mb-4 grid gap-6 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
                {booksToDisplay.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Book Cover - No padding */}
                    <div className="w-full h-64 overflow-hidden">
                      <Link to={`/books/show/${book.id}`}>
                        <img
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          src={
                            book.cover_photo
                              ? `${ImageStorage}/books/${book.cover_photo}`
                              : `${ImageStorage}/book-cover-placeholder.png`
                          }
                          alt={book.title}
                        />
                      </Link>
                    </div>

                    {/* Book Info */}
                    <div className="p-4">
                      <Link
                        to={`/books/show/${book.id}`}
                        className="block mb-2"
                      >
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {book.title}
                        </h3>
                      </Link>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-medium">
                          {getAuthorName(book.author_id)}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        <span>{getGenreName(book.genre_id)}</span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(book.price)}
                        </span>
                        {book.stock > 0 ? (
                          <span className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <Link
                          to={`/books/show/${book.id}`}
                          className="inline-flex items-center justify-center px-3 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg transition-colors dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleAddToCart(book.id)}
                          disabled={
                            isAddingToCart === book.id || book.stock === 0
                          }
                          className="inline-flex items-center justify-center px-3 py-2.5 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-amber-400 dark:hover:bg-amber-500 dark:focus:ring-amber-700"
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
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMoreBooks && (
                <div className="w-full text-center mt-8">
                  <button
                    onClick={loadMore}
                    className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                  >
                    Load More Books
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
              <p className="text-gray-500 text-lg mb-2">
                {searchTerm
                  ? "No books found matching your search."
                  : "No books available."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

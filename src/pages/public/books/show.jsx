import { useNavigate, useParams } from "react-router-dom";
import { useGenres } from "../../../_hooks/useGenres";
import { useAuthors } from "../../../_hooks/useAuthors";
import { useEffect, useState } from "react";
import { showBook } from "../../../_services/books";
import { bookImageStorage } from "../../../_api";
import { createTransaction } from "../../../_services/transactions";
import { useAuth } from "../../../_hooks/useAuth";

export default function ShowBook() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const { getGenreName, loading:loadingGenres } = useGenres();
  const { getAuthorName, loading:loadingAuthors } = useAuthors();
  const [book, setBook] = useState({})
  const [quantity, setQuantity] = useState(1)
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    try {
      const payload = {
        book_id: id,
        quantity: quantity
      }

      await createTransaction(payload);
      alert("Pembelian Berhasil")
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const loading = loadingAuthors || loadingGenres || loadingData;
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <section className="py-8 antialiased bg-white md:py-16 dark:bg-gray-900">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <div className="max-w-md mx-auto shrink-0 lg:max-w-lg">
              <img
                className="w-full dark:hidden"
                src={
                  book.cover_photo
                  ? `${bookImageStorage}/books/${book.cover_photo}`
                  : `${bookImageStorage}/book-cover-placeholder.png`
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

              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                  Rp{book.price}
                </p>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                    (5.0)
                  </p>
                  <a
                    href="#"
                    className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white"
                  >
                    345 Reviews
                  </a>
                </div>
              </div>

              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:mt-8">
                  <div>
                    <label 
                      htmlFor="quantity" 
                      className="block text-sm font-medium text-gray-700 dark:text-white">Jumlah</label>
                    <input 
                      type="number" 
                      id="quantity" 
                      name="quantity" 
                      value={quantity}
                      min={1} 
                      onChange={(e) => setQuantity(e.target.value)} 
                      className="block w-24 px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                    />
                  </div>
                  <button
                    type="submit"
                    className="text-white mt-4 sm:mt-0 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800 flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 -ms-2 me-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                      />
                    </svg>
                    Buy
                  </button>
                </form>
                
              </div>

              <hr className="my-6 border-gray-200 md:my-8 dark:border-gray-800" />

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

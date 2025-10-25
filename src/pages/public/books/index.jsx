import { Link } from "react-router-dom";
import { useAuthors } from "../../../_hooks/useAuthors";
import { useBooks } from "../../../_hooks/useBooks";
import { useGenres } from "../../../_hooks/useGenres";
import { bookImageStorage } from "../../../_api";

export default function Books() {
  const { getAuthorName, loading: loadingAuthors} = useAuthors();
    const { getGenreName, loading: loadingGenres } = useGenres();
  const{ books, loading: loadingBooks } = useBooks();

  const loading = loadingAuthors || loadingGenres || loadingBooks;
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          
            
            { books.length > 0 
              ? (
                <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
                  {books.map(book => (
                    <div key={book.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="h-56 w-full">
                        <Link to={`/books/show/${book.id}`}>
                          <img
                            className="mx-auto h-full"
                            src={
                              book.cover_photo
                              ? `${bookImageStorage}/books/${book.cover_photo}`
                              : `${bookImageStorage}/book-cover-placeholder.png`
                            }
                            alt="Book cover"
                          />
                        </Link>
                      </div>
                      <div className="pt-6">
                        <Link
                          to={`/books/show/${book.id}`}
                          className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                        >
                          {book.title}
                        </Link>

                        <ul className="mt-2 flex items-center gap-4">
                          <li className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                              />
                            </svg>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {getAuthorName(book.author_id)}
                            </p>
                          </li>

                          <li className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeWidth="2"
                                d="M8 7V6c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-1M3 18v-7c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                              />
                            </svg>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {getGenreName(book.genre_id)}
                            </p>
                          </li>
                        </ul>

                        <div className="mt-4 flex items-center justify-between gap-4">
                          <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
                            Rp{book.price}
                          </p>

                          <Link
                            to={`/books/show/${book.id}`}
                            className="inline-flex items-center rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4  focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                          >
                            {/* <svg
                              className="-ms-2 me-2 h-5 w-5"
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
                            </svg> */}
                            View Detail
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-screen">
                  <p className="text-gray-500 text-lg">No books found!</p>
                </div>
              )
            }

          
          <div className="w-full text-center">
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-indigo-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              Show more
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../_services/auth";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate()
  const [loadingLogout, setLoadingLogout] = useState(false)
  const token = localStorage.getItem("accessToken")
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))

  const handleLogout = async () => {
    setLoadingLogout(true)
    const token = localStorage.getItem("accessToken")

    if (token) {
      try {
        await logout({ token })
      } catch (err) {
        console.error("Error saat logout:", err)
      } finally {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("userInfo")
        setLoadingLogout(false)
        navigate("/login")
      }
    }
  }

  return (
    <>
      <header>
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <Link to="#" className="flex items-center">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="mr-3 h-6 sm:h-9"
                alt="Flowbite Logo"
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Flowbite
              </span>
            </Link>

            {/* Bagian kanan navbar */}
            <div className="flex items-center lg:order-2">
              {/* Tombol Cart */}
              <div className="mr-4">
                <NavLink to="cart" 
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 ${
                      isActive
                        ? "text-white rounded bg-indigo-700 lg:bg-transparent lg:text-indigo-700 lg:p-0 dark:text-white"
                        : "text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-indigo-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                    }`
                  }
                >
                  <svg
                    className="w-8 h-8"
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
                </NavLink>
              </div>

              {/* Jika user login */}
              {token && userInfo ? (
                <>
                  <span className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
                    {userInfo.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    disabled={loadingLogout}
                    className={`text-white font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none cursor-pointer ${
                      loadingLogout
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    }`}
                  >
                    {loadingLogout ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={"login"}
                    className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="register"
                    className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
                  >
                    Bergabung
                  </Link>
                </>
              )}

              <button
                data-collapse-toggle="mobile-menu-2"
                type="button"
                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mobile-menu-2"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 
                    2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 
                    110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 
                    0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Menu kiri */}
            <div
              className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
              id="mobile-menu-2"
            >
              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 ${
                        isActive
                          ? "text-white rounded bg-indigo-700 lg:bg-transparent lg:text-indigo-700 lg:p-0 dark:text-white"
                          : "text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-indigo-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                      }`
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="books"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 ${
                        isActive
                          ? "text-white rounded bg-indigo-700 lg:bg-transparent lg:text-indigo-700 lg:p-0 dark:text-white"
                          : "text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-indigo-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                      }`
                    }
                  >
                    Books
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink
                    to="blog"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 ${
                        isActive
                          ? "text-white rounded bg-indigo-700 lg:bg-transparent lg:text-indigo-700 lg:p-0 dark:text-white"
                          : "text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-indigo-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                      }`
                    }
                  >
                    Blog
                  </NavLink>
                </li> */}
                <li>
                  <NavLink
                    to="transactions"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 ${
                        isActive
                          ? "text-white rounded bg-indigo-700 lg:bg-transparent lg:text-indigo-700 lg:p-0 dark:text-white"
                          : "text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-indigo-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                      }`
                    }
                  >
                    Transactions
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>

  );
}
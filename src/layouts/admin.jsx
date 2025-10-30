import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout as apiLogout } from "../_services/auth";
import { useState } from "react";
import { useAuth } from "../_hooks/useAuth";

export default function AdminLayout() {
  const navigate = useNavigate()
  const { logout: contextLogout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogout = async () => {
    setLoadingLogout(true)
    const token = localStorage.getItem("accessToken")

    if (token) {
      try {
        await apiLogout({ token })
      } catch (err) {
        console.error("Error saat logout:", err)
      } finally {
        contextLogout();
        
        setLoadingLogout(false)
        navigate("/login")
      }
    }
  }

  return (
    <>
      <div className="antialiased bg-gray-50 dark:bg-gray-900">
        <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                data-drawer-target="drawer-navigation"
                data-drawer-toggle="drawer-navigation"
                aria-controls="drawer-navigation"
                className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <svg
                  aria-hidden="true"
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <svg
                  aria-hidden="true"
                  className="hidden w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Toggle sidebar</span>
              </button>
              <Link
                to="https://flowbite.com"
                className="flex items-center justify-between mr-4"
              >
                <i className="fa-sharp fa-solid fa-book-open-reader fa-2xl" style={{ color: "#0062ff" }}></i>
                <span className="self-center ml-2 text-2xl font-bold whitespace-nowrap dark:text-white">
                  BookSales
                </span>
              </Link>
            </div>
            <div className="flex items-center lg:order-2">
              <button
                type="button"
                className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded="false"
                onClick={toggleDropdown}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png"
                  alt="user photo"
                />
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute z-50 w-56 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl top-12 right-4"
                  id="dropdown"
                >
                  <div className="px-4 py-3">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Neil Sims
                    </span>
                    <span className="block text-sm text-gray-900 truncate dark:text-white">
                      name@flowbite.com
                    </span>
                  </div>
                  <ul
                    className="py-1 text-gray-700 dark:text-gray-300"
                    aria-labelledby="dropdown"
                  >
                    <li>
                      <button
                        onClick={handleLogout}
                        disabled={loadingLogout}
                        className={`block w-full text-left py-2 px-4 text-sm ${
                          loadingLogout
                            ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                        }`}
                      >
                        {loadingLogout ? 'Logging out...' : 'Logout'}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* <!-- Sidebar --> */}

        <aside
          className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full bg-white border-r border-gray-200 pt-14 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
          aria-label="Sidenav"
          id="drawer-navigation"
        >
          <div className="h-full px-3 py-5 overflow-y-auto bg-white dark:bg-gray-800">
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="admin"
                  className={({ isActive }) =>
                    `flex items-center p-2 text-base font-medium rounded-lg group transition duration-75
                    ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  <span className="ml-3">Overview</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `flex items-center p-2 text-base font-medium rounded-lg transition duration-75 group
                    ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-3">Users</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/authors"
                  className={({ isActive }) =>
                    `flex items-center p-2 text-base font-medium rounded-lg transition duration-75 group
                    ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-3">Authors</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/genres"
                  className={({ isActive }) =>
                    `flex items-center p-2 text-base font-medium rounded-lg transition duration-75 group
                    ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-3">Genres</span>
                </NavLink>
              </li>
            </ul>

            <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
              <li>
                <NavLink
                  to="/admin/books"
                  className={({ isActive }) =>
                    `flex items-center p-2 text-base font-medium rounded-lg transition duration-75 group
                    ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-3">Books</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/transactions"
                  className={({ isActive }) =>
                    `flex items-center p-2 text-base font-medium rounded-lg transition duration-75 group
                    ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-3">Transaction</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/help"
                  className={({ isActive }) =>
                    `flex items-center p-2 text-base font-medium rounded-lg transition duration-75 group
                    ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-3">Help</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </aside>

        <main className="h-auto p-4 pt-20 md:ml-64">
          <div className="h-auto px-4 pt-4 pb-6 border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}

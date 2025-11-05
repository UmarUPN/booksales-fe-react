import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer className="border-t-2 p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800">
        <div className="mx-auto max-w-screen-xl text-center">
          <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
            <li>
              <NavLink
                to="about"
                className={({ isActive }) =>
                  `mr-4 hover:underline md:mr-6 ${
                    isActive
                      ? "text-white rounded bg-indigo-700 lg:bg-transparent lg:text-indigo-700 lg:p-0 dark:text-white"
                      : "text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-indigo-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  }`
                }
              >
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="contact"
                className={({ isActive }) =>
                  `mr-4 hover:underline md:mr-6 ${
                    isActive
                      ? "text-white rounded bg-indigo-700 lg:bg-transparent lg:text-indigo-700 lg:p-0 dark:text-white"
                      : "text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-indigo-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  }`
                }
              >
                Contact to Admin
              </NavLink>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                Campaigns
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Affiliate Program
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Contact
              </a>
            </li>
          </ul>
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            ©{" "}
            <a href="#" className="hover:underline">
              2025
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </>
  );
}
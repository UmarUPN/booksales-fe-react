import { Link, useNavigate } from "react-router-dom";
import { login } from "../../_services/auth";
import { useEffect, useState } from "react";
import { useAuth } from "../../_hooks/useAuth";

export default function Login() {
  const navigate = useNavigate()
  const { isAuthenticated, user, login: contextLogin } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState({
    login: null,
    email: null,
    password: null,
  });
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [loadingCheckAuth, setLoadingCheckAuth] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user.role === "admin" ? "/admin" : "/")
    } else {
      setLoadingCheckAuth(false)
    }
  }, [isAuthenticated, user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingSignIn(true)
    setErrors({
      login: null,
      email: null,
      password: null,
    })

    try {
      const response = await login(formData)
      console.log(response)

      contextLogin(response.token, response.user);
      
      navigate(response.user.role === "admin" ? "/admin" : "/")
    } catch (error) {
      const errData = error?.response?.data || {};

      setErrors({
        login: errData.message || "Pastikan semua field diisi dengan benar!",
        email: errData?.errors?.email?.[0] || errData?.email?.[0] || null,
        password: errData?.errors?.password?.[0] || errData?.password?.[0] || null,
      });
    } finally {
      setLoadingSignIn(false)
    }
  }

  if (loadingCheckAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>

              {errors.login && (
                <div className="text-red-500 text-sm">{errors.login}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                  {errors.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                  {errors.password && (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                  )}
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the{" "}
                      <a
                        className="font-medium text-indigo-600 hover:underline dark:text-indigo-500"
                        href="#"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loadingSignIn}
                  className={`w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 ${
                    loadingSignIn ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loadingSignIn ? 'Signing in...' : 'Sign in'}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    to={"/register"}
                    className="font-medium text-indigo-600 hover:underline dark:text-indigo-500"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

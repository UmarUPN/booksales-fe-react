import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, useDecodeToken } from "../../_services/auth";

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    notelp: "",
    photo: null,
  })

  const [errors, setErrors] = useState({
    register: null,
    name: null,
    email: null,
    username: null,
    password: null,
    notelp: null,
    photo: null,
  });
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [loadingCheckAuth, setLoadingCheckAuth] = useState(true);

  const decodedData = useDecodeToken(localStorage.getItem("accessToken"))

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const userInfo = localStorage.getItem("userInfo")

    console.log(decodedData)
    if (decodedData?.success) {
      if (token && userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo)
          if (parsedUser?.role) {
            navigate(parsedUser.role === "admin" ? "/admin" : "/")
            return
          }
        } catch (err) {
          console.error("Error parsing userInfo:", err)
          navigate("/")
          return
        }
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
      }
    }
    setLoadingCheckAuth(false)
  }, [decodedData, navigate])

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "photo" ? files[0] : value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSignUp(true);
    setErrors({
      register: null,
      name: null,
      email: null,
      username: null,
      password: null,
      notelp: null,
      photo: null,
    });

    try {
      const response = await register(formData);
      console.log(response);

      navigate("/login");
    } catch (error) {
      const errData = error?.response?.data || {};

      setErrors({
        register: errData.message || "Pastikan semua field diisi dengan benar!",
        name: errData?.errors?.name?.[0] || errData?.name?.[0] || null,
        email: errData?.errors?.email?.[0] || errData?.email?.[0] || null,
        username: errData?.errors?.username?.[0] || errData?.username?.[0] || null,
        password: errData?.errors?.password?.[0] || errData?.password?.[0] || null,
        notelp: errData?.errors?.notelp?.[0] || errData?.notelp?.[0] || null,
        photo: errData?.errors?.photo?.[0] || errData?.photo?.[0] || null,
      });
    } finally {
      setLoadingSignUp(false);
    }
  };

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
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-2xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
    
              {errors.register && (
                <div className="text-red-500 text-sm">{errors.register}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Jon Doe"
                      // required
                    />
                    {errors.name && (
                      <div className="text-red-500 text-sm">{errors.name}</div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Name@example.com"
                      // required
                    />
                    {errors.email && (
                      <div className="text-red-500 text-sm">{errors.email}</div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Create username"
                      // required
                    />
                    {errors.username && (
                      <div className="text-red-500 text-sm">{errors.username}</div>
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
                      // required
                    />
                    {errors.password && (
                      <div className="text-red-500 text-sm">{errors.password}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="notelp"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      No. Telepon
                    </label>
                    <input
                      type="text"
                      name="notelp"
                      id="notelp"
                      value={formData.notelp}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                      placeholder="01234567890"
                      // required=""
                    />
                    {errors.notelp && (
                      <div className="text-red-500 text-sm">{errors.notelp}</div>
                    )}
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="photo"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Profile Photo
                    </label>
                    <input
                      type="file"
                      name="photo"
                      id="photo"
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      accept="image/*"
                      // required=""
                    />
                    {errors.photo && (
                      <div className="text-red-500 text-sm">{errors.photo}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                      required
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
                  disabled={loadingSignUp}
                  className={`w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 ${
                    loadingSignUp ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loadingSignUp ? 'Creating an account...' : 'Create an account'}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to={"/login"}
                    className="font-medium text-indigo-600 hover:underline dark:text-indigo-500"
                  >
                    Login here
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

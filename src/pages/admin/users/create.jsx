import { useNavigate } from "react-router-dom";
import { createUser } from "../../../_services/users";
import { useState } from "react";

export default function UserCreate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "",
    notelp: "",
    photo: null,
  });

  const [errors, setErrors] = useState({
    create: null,
    name: null,
    email: null,
    username: null,
    password: null,
    role: null,
    notelp: null,
    photo: null,
  });
  const [loadingCreate, setLoadingCreate] = useState(false);

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "photo" ? files[0] : value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    setErrors({
      create: null,
      name: null,
      email: null,
      username: null,
      password: null,
      role: null,
      notelp: null,
      photo: null,
    });

    try {
      const payload = new FormData();
      for (const key in formData) {
        if (key === "photo") {
          if (formData.photo instanceof File) {
            payload.append("photo", formData.photo);
          }
        } else {
          payload.append(key, formData[key]);
        }
      }

      await createUser(payload);
      navigate("/admin/users");
    } catch (error) {
      const errData = error?.response?.data || {};

      setErrors({
        create: errData.message || "Pastikan semua field diisi dengan benar!",
        name: errData?.errors?.name?.[0] || errData?.name?.[0] || null,
        email: errData?.errors?.email?.[0] || errData?.email?.[0] || null,
        username: errData?.errors?.username?.[0] || errData?.username?.[0] || null,
        password: errData?.errors?.password?.[0] || errData?.password?.[0] || null,
        role: errData?.errors?.role?.[0] || errData?.role?.[0] || null,
        notelp: errData?.errors?.notelp?.[0] || errData?.notelp?.[0] || null,
        photo: errData?.errors?.photo?.[0] || errData?.photo?.[0] || null,
      });
    } finally {
      setLoadingCreate(false)
    }
  }

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Create New User
          </h2>

          {errors.create && (
            <div className="text-red-500 text-sm">{errors.create}</div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
              <div className="sm:col-span-2">
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  placeholder="John Doe"
                  // required=""
                />
                {errors.name && (
                  <div className="text-red-500 text-sm">{errors.name}</div>
                )}
              </div>
              <div className="sm:col-span-2">
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  placeholder="example@mail.com"
                  // required=""
                />
                {errors.email && (
                  <div className="text-red-500 text-sm">{errors.email}</div>
                )}
              </div>
              <div className="sm:col-span-2">
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  placeholder="JohnDoe"
                  // required=""
                />
                {errors.username && (
                  <div className="text-red-500 text-sm">{errors.username}</div>
                )}
              </div>
              <div className="sm:col-span-2">
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  placeholder="••••••••"
                  // required=""
                />
                {errors.password && (
                  <div className="text-red-500 text-sm">{errors.password}</div>
                )}
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                >
                  <option value="">--select role--</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
                {errors.role && (
                  <div className="text-red-500 text-sm">{errors.role}</div>
                )}
              </div>
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
                  placeholder="0123456789"
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
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={loadingCreate}
                className={`cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 ${
                  loadingCreate ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loadingCreate ? 'Creating user...' : 'Create user'}
              </button>
              {/* <button
                type="reset"
                className="text-gray-600 inline-flex items-center hover:text-white border border-gray-600 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-900"
              >
                Reset
              </button> */}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

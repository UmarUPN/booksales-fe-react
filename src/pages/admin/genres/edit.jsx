import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showGenre, updateGenre } from "../../../_services/genres";

export default function GenreEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    _method: "PUT",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genreData] = await Promise.all([showGenre(id)]);

        setFormData({
          name: genreData.name,
          description: genreData.description,
          _method: "PUT",
        })
      } catch (error) {
        console.error("Failed to fetch genre:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      for (const key in formData) {
        payload.append(key, formData[key]);
      }

      await updateGenre(id, payload);
      navigate("/admin/genres");
    } catch (error) {
      console.error("Failed to update genre:", error)
      console.log(error)
      alert("Error update genre")
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Edit Genre
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
              <div className="sm:col-span-2">
                <label
                  for="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Genre Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  placeholder="e.g. Romance"
                  required=""
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  for="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  placeholder="Write a genre description here..."
                >
                </textarea>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
              >
                Update Genre
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

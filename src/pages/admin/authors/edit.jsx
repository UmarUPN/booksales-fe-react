import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showAuthor, updateAuthor } from "../../../_services/authors";

export default function AuthorEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loadingData, setLoadingData] = useState(true)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    photo: null,
    bio: "",
    _method: "PUT",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorData] = await Promise.all([showAuthor(id)]);

        setFormData({
          name: authorData.name,
          photo: authorData.photo,
          bio: authorData.bio,
          _method: "PUT",
        })
      } catch (error) {
        console.error("Failed to fetch author:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [id])

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingEdit(true);

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

      await updateAuthor(id, payload);
      navigate("/admin/authors");
    } catch (error) {
      console.error("Failed to update author:", error)
      alert("Error update author")
    } finally {
      setLoadingEdit(false);
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
            Edit Author
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Author Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  placeholder="e.g. Umar Mukhtar"
                  required=""
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="photo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Author Photo
                </label>
                <input
                  type="file"
                  name="photo"
                  id="photo"
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  accept="image/*"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="bio"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="6"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  placeholder="Write a author bio here..."
                >
                </textarea>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={loadingEdit}
                className={`cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 ${
                  loadingEdit ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loadingEdit ? 'Updating data...' : 'Update data'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

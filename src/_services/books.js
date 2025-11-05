import { API } from "../_api"

export const getBooks = async () => {
  const { data } = await API.get("/books")
  return data.data
}

export const createBook = async (data) => {
  try {
    const response = await API.post("/books", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const showBook = async (id) => {
  try {
    const { data } = await API.get(`/books/${id}`)
    return data.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateBook = async (id, data) => {
  try {
    const response = await API.post(`/books/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
    return response
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deleteBook = async (id) => {
  try {
    await API.delete(`/books/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
  } catch (error) {
    console.log(error);
    throw error
  }
}
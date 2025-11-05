import { API } from "../_api"

export const getUsers = async () => {
  const { data } = await API.get("/users")
  return data.data
}

export const createUser = async (data) => {
  try {
    const response = await API.post("/users", data, {
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

export const showUser = async (id) => {
  try {
    const { data } = await API.get(`/users/${id}`)
    return data.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateUser = async (id, data) => {
  try {
    const response = await API.post(`/users/${id}`, data, {
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

export const deleteUser = async (id) => {
  try {
    await API.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
  } catch (error) {
    console.log(error);
    throw error
  }
}
import { API } from "../_api"

export const getCartItems = async () => {
  try {
    const response = await API.get("/cart-items", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    return response.data.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const createCartItem = async (data) => {
  try {
    const response = await API.post("/cart-items", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const showCartItem = async (id) => {
  try {
    const response = await API.get(`/cart-items/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    return response.data.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateCartItem = async (id, data) => {
  try {
    const response = await API.post(`/cart-items/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteCartItem = async (id) => {
  try {
    await API.delete(`/cart-items/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}

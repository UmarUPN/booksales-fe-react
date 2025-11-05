import { API } from "../_api"

export const getTransactions = async () => {
  try {
    const response = await API.get("/transactions", {
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

export const getTransactionDetail = async (id) => {
  try {
    const response = await API.get(`/transactions/${id}`, {
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

export const createTransaction = async () => {
  try {
    const response = await API.post("/transactions", {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTransactionStatus = async (id, status) => {
  try {
    const response = await API.post(`/transactions/${id}`, {
      _method: "PUT",
      status
    }, {
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

export const deleteTransaction = async (id) => {
  try {
    await API.delete(`/transactions/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}

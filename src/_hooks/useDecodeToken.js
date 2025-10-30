import { useJwt } from "react-jwt";

export const useDecodeToken = (token) => {
  const { decodedToken, isExpired, error } = useJwt(token);

  console.log("🔍 useJwt Debug:");
  console.log("Token:", token ? "Ada" : "Tidak ada");
  console.log("Decoded:", decodedToken);
  console.log("Is Expired:", isExpired);
  console.log("Error:", error);

  // Loading state - ketika pertama kali mount
  if (!token) {
    return {
      success: false,
      message: "Token tidak ada!",
      data: null,
      isLoading: false
    };
  }

  // Loading state - menunggu decodedToken terisi
  if (token && !decodedToken && !error) {
    return {
      success: false,
      message: "Checking token...",
      data: null,
      isLoading: true
    };
  }

  if (error) {
    return {
      success: false,
      message: `Token error: ${error.message}`,
      data: null,
      isLoading: false
    };
  }

  if (isExpired) {
    return {
      success: false,
      message: "Token expired!",
      data: decodedToken,
      isLoading: false
    };
  }

  if (decodedToken) {
    return {
      success: true,
      message: "Token valid!",
      data: decodedToken,
      isLoading: false
    };
  }

  // Fallback
  return {
    success: false,
    message: "Unknown token state",
    data: null,
    isLoading: false
  };
};
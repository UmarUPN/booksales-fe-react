import { createContext, useEffect, useState } from "react";
import { useDecodeToken } from "../_hooks/useDecodeToken";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("accessToken") || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const decodedData = useDecodeToken(token);

  console.log("🔐 DEBUG AuthProvider:");
  console.log("Token:", token);
  console.log("User:", user);
  console.log("Decoded Data:", decodedData);
  console.log("isAuthenticated:", isAuthenticated);
  console.log("isInitialized:", isInitialized);

  useEffect(() => {
    console.log("🔄 Auth Check Running...");
    
    // Skip initial loading
    if (!isInitialized && decodedData.message === "Checking token...") {
      console.log("⏳ Skipping initial check...");
      return;
    }

    if (!isInitialized) { // jika decodedData.message bukan "Checking token..."
      setIsInitialized(true);
    }

    if (!token) {
      console.log("❌ No token");
      setIsAuthenticated(false);
      return;
    }

    // Jika token ada tapi masih loading, tunggu
    if (!decodedData || decodedData.message === "Checking token...") {
      console.log("⏳ Waiting for token validation...");
      return;
    }

    if (decodedData && !decodedData.success) {
      console.log("❌ Token invalid:", decodedData.message);
      setIsAuthenticated(false);
      logout();
      return;
    }

    if (decodedData && decodedData.success && user) {
      console.log("✅ Token valid, user authenticated");
      setIsAuthenticated(true);
    }
  }, [decodedData, token, user, isInitialized]);

  const login = (userToken, userData) => {
    console.log("🔑 Login process...");
    
    // Set state langsung
    setToken(userToken);
    setUser(userData);
    setIsAuthenticated(true);
    setIsInitialized(true);

    // Simpan ke localStorage
    localStorage.setItem("accessToken", userToken);
    localStorage.setItem("userInfo", JSON.stringify(userData));
    
    console.log("✅ Login completed");
  };

  const logout = () => {
    console.log("🚪 Logout process...");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsInitialized(true);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      token, 
      login, 
      logout,
      isInitialized 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
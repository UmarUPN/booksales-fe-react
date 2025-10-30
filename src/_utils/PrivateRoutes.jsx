import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../_hooks/useAuth";

const PrivateRoutes = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  // return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) { // jika allowedRole(di app.jsx : admin) tidak sama dengan user.role(role user yang aktif saat ini) 
    // role tidak diizinkan
    return <Navigate to="/" replace />; // user yang login tapi bukan admin juga langsung di-redirect ke /
  }

  // jika lolos semua pengecekan
  return children;
};

export default PrivateRoutes;

// replace yaitu Ganti halaman saat ini di history browser dengan /login, 
// sehingga user tidak bisa kembali ke halaman sebelumnya dengan tombol "Back".
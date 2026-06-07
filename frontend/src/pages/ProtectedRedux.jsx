// components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuth = useSelector((state) => state.user.isAuthenticated);

  return isAuth ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
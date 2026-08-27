import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminProtectedRoute() {
  const { isAuthenticated } = useSelector((state) => state.admin);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace/>
    );
  }
  return <Outlet />;
}

export default AdminProtectedRoute;
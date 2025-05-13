import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";

interface RoleBasedProvider {
    allowedRoles: string[]
}

const RoleBasedProvider = ({ allowedRoles }: RoleBasedProvider) => {
  const { roles, user } = useAuthStore((state) => state);
  const location = useLocation();
  const isAdminVerified = localStorage.getItem("admin-verified") === "true";

  console.log(roles);
  if (!user || !roles) {
    return <Navigate to="/" replace />;
  }

  if (
    location.pathname === "/admin-portal" &&
    allowedRoles.includes(roles) &&
    !isAdminVerified
  ) {
    return <Navigate to="/verify-admin-otp" replace />;
  }


  if (!allowedRoles.includes(roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default RoleBasedProvider;
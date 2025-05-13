import Sidebar from "./components/share-components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const AdminPageMainLayout = () => {
  const location = useLocation();
  const isVerifyOTPPage = location.pathname === "/verify-admin-otp";

  return (
    <div className="flex h-screen">
      {!isVerifyOTPPage && <Sidebar />}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPageMainLayout;

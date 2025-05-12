import useAuthStore from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";


const RouteProvider = () => {

    const { user } = useAuthStore();

    if(!user) return <Navigate to={"/"} replace/>


  return <Outlet />;
};

export default RouteProvider;

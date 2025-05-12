import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";

interface RoleBasedProvider {
    allowedRoles: string[]
}

const RoleBasedProvider = ({ allowedRoles }: RoleBasedProvider) => {
    const { roles, user } = useAuthStore(state => state);
    console.log(roles);
    if(!user || !roles){
        return <Navigate to="/" replace/>
    }

    if(!allowedRoles.includes(roles)){
        return <Navigate to="/unauthorized" replace />
    }

    return <Outlet/>;
}

export default RoleBasedProvider;
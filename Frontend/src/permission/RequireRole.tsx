import useAuthStore from "@/stores/useAuthStore";
import UnauthorizedMessage from "./UnauthorizedMessage";

interface RequireRoleProps{
    allowedRoles: string[],
    children: React.ReactNode;
}

const RequireRole = ({ allowedRoles, children }: RequireRoleProps) => {
    const user = useAuthStore((state) => state.user);

    if (!user || !allowedRoles.includes(user.role)){
        return null;
    }

    return <>{children}</>
}

export default RequireRole;

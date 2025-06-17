import {Outlet} from "react-router-dom";
import {userStore} from "@/lib/userStore";
import {Loading} from "@/pages/Shared/Loading.tsx";
import {Login} from "@/pages/Shared/Login.tsx";

interface ProtectedRouteProps {
    requiredRole?: string;
}

export function ProtectedRoute({
                                   requiredRole,
                               }: ProtectedRouteProps) {
    const {isLoggedIn, isCheckingAuth, userData} = userStore();

    if (isCheckingAuth) {
        return <Loading/>;
    }

    if (!isLoggedIn || (requiredRole && userData.roleName !== requiredRole)) {
        return <Login/>;
    }
    return <Outlet/>;
}
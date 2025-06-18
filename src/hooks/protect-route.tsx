import {Outlet} from "react-router-dom";
import {userStore} from "@/lib/userStore";
import {LoadingPage} from "@/pages/Shared/LoadingPage.tsx";
import {LoginPage} from "@/pages/Shared/LoginPage.tsx";

interface ProtectedRouteProps {
    requiredRole?: string;
}

export function ProtectedRoute({
                                   requiredRole,
                               }: ProtectedRouteProps) {
    const {isAuthenticated, isCheckingAuth, userData} = userStore();

    if (isCheckingAuth) {
        return <LoadingPage/>;
    }

    if (!isAuthenticated || (requiredRole && userData.roleName !== requiredRole)) {
        return <LoginPage/>;
    }
    return <Outlet/>;
}
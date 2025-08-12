import React, {useEffect} from "react";
import {userStore} from "@/lib/userStore.ts";
import {Navigate, useLocation} from "react-router-dom";
import {AppRoles} from "@/enums/app-roles.tsx";
import {AudioEngineerOutlet} from "@/pages/AudioEngineer/AudioEngineerOutlet.tsx";
import {ClientOutlet} from "@/pages/Client/ClientOutlet.tsx";
import {GuestOutletWithSidebar} from "@/pages/Guest/GuestOutletWithSidebar.tsx";

export function OutletSwitcher() {
    const {userData} = userStore();

    switch (userData.roleName) {
        case AppRoles.AudioEngineer:
            return <AudioEngineerOutlet/>;
        case AppRoles.Client:
            return <ClientOutlet/>;
        case AppRoles.Admin:
            return null;
        default:
            return <GuestOutletWithSidebar/>;
    }
}

export const ProtectedRoute = ({allowedRoles, children}: {allowedRoles: AppRoles[], children: React.ReactElement }) => {
    const {isAuthenticated, userData} = userStore();

    const userInRole = allowedRoles.includes(userData.roleName as AppRoles);

    if (!userInRole && !isAuthenticated) {
        return <Navigate to='/' replace/>;
    }

    return children;
};

export const RedirectAuthenticatedUser = ({children}: { children: React.ReactElement }) => {
    const {isAuthenticated} = userStore();

    if (isAuthenticated) {
        return <Navigate to='/' replace/>;
    }

    return children;
};

export function ScrollToTop() {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
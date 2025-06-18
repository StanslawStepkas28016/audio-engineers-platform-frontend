import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {LoginPage} from "@/pages/Shared/LoginPage.tsx";
import {AudioEngineerHomepage} from "@/pages/Engineer/AudioEngineerHomepage.tsx";
import {NotFoundPage} from "@/pages/Shared/NotFoundPage.tsx";
import {RegisterPage} from "@/pages/Shared/RegisterPage.tsx";
import {VerifyAccountPage} from "@/pages/Shared/VerifyAccountPage.tsx";
import React, {useEffect} from "react";
import {userStore} from "@/lib/userStore.ts";
import {AudioEngineerAddAdvertPage} from "@/pages/Engineer/AudioEngineerAddAdvertPage.tsx";
import {LoadingPage} from "@/pages/Shared/LoadingPage.tsx";
import {AppRoles} from "@/shared/app-roles.tsx";


const ProtectedRoute = ({children}: { children: React.ReactElement }) => {
    const {isAuthenticated} = userStore();

    if (!isAuthenticated) {
        return <Navigate to='/login' replace/>;
    }

    return children;
};

export const HomeRouter: React.FC = () => {
    const {userData} = userStore();

    switch (userData?.roleName) {
        case AppRoles.AudioEngineer:
            return <AudioEngineerHomepage/>;
        case AppRoles.Client:
            return <LoadingPage/>;
        default:
            return <Navigate to="/login" replace/>;
    }
};


function App() {
    const {isCheckingAuth, checkAuth} = userStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) {
        return <LoadingPage/>;
    }

    return (
        <Router>
            <Routes>
                <Route path="*" element={<NotFoundPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/verify-account" element={<VerifyAccountPage/>}/>

                {/* Audio engineer routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <HomeRouter/>
                    </ProtectedRoute>
                }
                />

                <Route path="/add-advert" element={
                    <ProtectedRoute>
                        <AudioEngineerAddAdvertPage/>
                    </ProtectedRoute>
                }
                />


                {/*Client routes*/}
                {/*Admin routes*/}
            </Routes>
        </Router>
    );
}

export default App;

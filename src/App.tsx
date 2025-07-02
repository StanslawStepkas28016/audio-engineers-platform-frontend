import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {LoginPage} from "@/pages/Shared/LoginPage.tsx";
import {AudioEngineerHomepage} from "@/pages/AudioEngineer/AudioEngineerHomepage.tsx";
import {NotFoundPage} from "@/pages/Shared/NotFoundPage.tsx";
import {RegisterPage} from "@/pages/Shared/RegisterPage.tsx";
import {VerifyAccountPage} from "@/pages/Shared/VerifyAccountPage.tsx";
import React, {useEffect} from "react";
import {userStore} from "@/lib/userStore.ts";
import {AudioEngineerAddAdvert} from "@/pages/AudioEngineer/AudioEngineerAddAdvert.tsx";
import {LoadingPage} from "@/pages/Shared/LoadingPage.tsx";
import {AudioEngineerSeeAllAdverts} from "@/pages/AudioEngineer/AudioEngineerSeeAllAdverts.tsx";
import {AudioEngineerSeeYourAdvert} from "@/pages/AudioEngineer/AudioEngineerSeeYourAdvert.tsx";
import {AudioEngineerDeleteAdvert} from "@/pages/AudioEngineer/AudioEngineerDeleteAdvert.tsx";
import {AudioEngineerChangeData} from "@/pages/AudioEngineer/AudioEngineerChangeData.tsx";
import {AudioEngineerChangePassword} from "@/pages/AudioEngineer/AudioEngineerChangePassword.tsx";
import {ClientHomepage} from "@/pages/Client/ClientHomepage.tsx";
import {ClientAdverts} from "@/pages/Client/ClientAdverts.tsx";
import {AppRoles} from "@/enums/app-roles.tsx";
import {AudioEngineerEditAdvert} from "@/pages/AudioEngineer/AudioEngineerEditAdvert.tsx";
import {GuestHomepage} from "@/pages/Guest/GuestHomepage.tsx";


const ProtectedRoute = ({children}: { children: React.ReactElement }) => {
    const {isAuthenticated} = userStore();

    if (!isAuthenticated) {
        return <Navigate to='/login' replace/>;
    }

    return children;
};

const RedirectAuthenticatedUser = ({children}: { children: React.ReactElement }) => {
    const {isAuthenticated} = userStore();

    if (isAuthenticated) {
        return <Navigate to='/' replace/>;
    }

    return children;
};

function App() {
    const {isCheckingAuth, checkAuth, userData} = userStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) {
        return <LoadingPage/>;
    }

    return (
        <Router>
            <Routes>
                {/* Guest routes */}
                <Route path="*" element={
                    <NotFoundPage/>
                }/>

                <Route path="/" element={<GuestHomepage/>}/>

                <Route path="/login" element={
                    <RedirectAuthenticatedUser>
                        <LoginPage/>
                    </RedirectAuthenticatedUser>
                }
                />

                <Route path="/register" element={
                    <RedirectAuthenticatedUser>
                        <RegisterPage/>
                    </RedirectAuthenticatedUser>
                }
                />

                <Route path="/verify-account" element={
                    <RedirectAuthenticatedUser>
                        <VerifyAccountPage/>
                    </RedirectAuthenticatedUser>
                }/>

                {/* Audio engineer routes */}
                {userData.roleName === AppRoles.AudioEngineer && (
                    <Route element={
                        <ProtectedRoute>
                            <AudioEngineerHomepage/>
                        </ProtectedRoute>
                    }>
                        <Route index element={<AudioEngineerSeeAllAdverts/>}/>
                        <Route path="my-advert" element={<AudioEngineerSeeYourAdvert/>}/>
                        <Route path="add-advert" element={<AudioEngineerAddAdvert/>}/>
                        <Route path="edit-advert" element={<AudioEngineerEditAdvert/>}/>
                        <Route path="delete-advert" element={<AudioEngineerDeleteAdvert/>}/>
                        <Route path="change-data" element={<AudioEngineerChangeData/>}/>
                        <Route path="change-password" element={<AudioEngineerChangePassword/>}/>
                    </Route>
                )}

                {/* Client routes */}
                {userData.roleName === AppRoles.Client && (
                    <Route element={
                        <ProtectedRoute>
                            <ClientHomepage/>
                        </ProtectedRoute>
                    }>
                        <Route index element={<ClientAdverts/>}/>
                    </Route>
                )}

                {/*Admin routes*/}
                // TODO: Add admin routes

            </Routes>
        </Router>
    );
}

export default App;

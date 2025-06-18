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
import {AudioEngineerAdverts} from "@/pages/AudioEngineer/AudioEngineerAdverts.tsx";
import {AudioEngineerSeeYourAdvert} from "@/pages/AudioEngineer/AudioEngineerSeeYourAdvert.tsx";
import {AudioEngineerDeleteAdvert} from "@/pages/AudioEngineer/AudioEngineerDeleteAdvert.tsx";
// import {AppRoles} from "@/shared/app-roles.tsx";


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
                <Route path="*" element={
                    <NotFoundPage/>
                }/>

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
                <Route
                    element={
                        <ProtectedRoute>
                            <AudioEngineerHomepage/>
                        </ProtectedRoute>
                    }
                >
                    {/* See all adverts */}
                    <Route index element={
                        <ProtectedRoute>
                            <AudioEngineerAdverts/>
                        </ProtectedRoute>
                    }/>

                    {/* See your advert */}
                    <Route path="/my-advert" element={
                        <ProtectedRoute>
                            <AudioEngineerSeeYourAdvert/>
                        </ProtectedRoute>
                    }/>

                    {/* Adding advert component */}
                    <Route path="/add-advert" element={
                        <ProtectedRoute>
                            <AudioEngineerAddAdvert/>
                        </ProtectedRoute>
                    }
                    />

                    {/* Editing your advert */}
                    <Route path="/edit-advert" element={
                        <ProtectedRoute>
                            <AudioEngineerSeeYourAdvert/>
                        </ProtectedRoute>
                    }/>

                    {/* Deleting your advert */}
                    <Route path="/delete-advert" element={
                        <ProtectedRoute>
                            <AudioEngineerDeleteAdvert/>
                        </ProtectedRoute>
                    }/>

                </Route>

                {/*Client routes*/}
                // TODO: Add client routes

                {/*Admin routes*/}
                // TODO: Add admin routes

            </Routes>
        </Router>
    );
}

export default App;

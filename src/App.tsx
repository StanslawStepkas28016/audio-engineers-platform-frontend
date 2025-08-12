import {BrowserRouter, Route, Routes} from "react-router-dom";
import {LoginPage} from "@/pages/Shared/LoginPage.tsx";
import {RegisterPage} from "@/pages/Shared/RegisterPage.tsx";
import {VerifyAccountPage} from "@/pages/Shared/VerifyAccountPage.tsx";
import {useEffect} from "react";
import {userStore} from "@/lib/userStore.ts";
import {AudioEngineerAddAdvert} from "@/pages/AudioEngineer/AudioEngineerAddAdvert.tsx";
import {LoadingPage} from "@/pages/Shared/LoadingPage.tsx";
import {SeeAllAdverts} from "@/pages/Shared/SeeAllAdverts.tsx";
import {AudioEngineerSeeYourAdvert} from "@/pages/AudioEngineer/AudioEngineerSeeYourAdvert.tsx";
import {AudioEngineerDeleteAdvert} from "@/pages/AudioEngineer/AudioEngineerDeleteAdvert.tsx";
import {AudioEngineerEditAdvert} from "@/pages/AudioEngineer/AudioEngineerEditAdvert.tsx";
import {SeeAdvert} from "@/pages/Shared/SeeAdvert.tsx";
import {ChangeData} from "@/pages/Shared/ChangeData.tsx";
import {VerifyResetEmailPage} from "@/pages/Shared/VerifyResetEmailPage.tsx";
import {OutletSwitcher, ProtectedRoute, RedirectAuthenticatedUser, ScrollToTop} from "@/hooks/routing-hooks.tsx";
import {GuestOutletWithoutSidebar} from "@/pages/Guest/GuestOutletWithoutSidebar.tsx";
import {AppRoles} from "@/enums/app-roles.tsx";


function App() {
    const {isCheckingAuth, checkAuth} = userStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) {
        return <LoadingPage/>;
    }

    return (
        <BrowserRouter>
            <ScrollToTop/>
            <Routes>
                {/* Shared routes */}
                <Route element={
                    <OutletSwitcher/>
                }>
                    <Route index element={<SeeAllAdverts/>}/>
                    <Route path="see-advert/:idAdvert" element={<SeeAdvert/>}/>
                </Route>

                {/* Guest routes */}
                <Route element={
                    <RedirectAuthenticatedUser>
                        <GuestOutletWithoutSidebar/>
                    </RedirectAuthenticatedUser>
                }>

                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/verify-account" element={<VerifyAccountPage/>}/>
                    <Route path="/:resetEmailToken/verify-reset-email" element={<VerifyResetEmailPage/>}/>
                </Route>

                {/* Shared protected routes */}
                <Route element={
                    <ProtectedRoute allowedRoles={[AppRoles.Client, AppRoles.Admin, AppRoles.AudioEngineer]}>
                        <OutletSwitcher/>
                    </ProtectedRoute>
                }>
                    <Route path="change-data" element={<ChangeData/>}/>
                </Route>


                {/* Audio engineer routes */}
                <Route element={
                    <ProtectedRoute allowedRoles={[AppRoles.AudioEngineer]}>
                        <OutletSwitcher/>
                    </ProtectedRoute>
                }>
                    <Route path="my-advert" element={<AudioEngineerSeeYourAdvert/>}/>
                    <Route path="add-advert" element={<AudioEngineerAddAdvert/>}/>
                    <Route path="edit-advert" element={<AudioEngineerEditAdvert/>}/>
                    <Route path="delete-advert" element={<AudioEngineerDeleteAdvert/>}/>
                </Route>


                {/* Client routes */}
                <Route element={
                    <ProtectedRoute allowedRoles={[AppRoles.Client]}>
                        <OutletSwitcher/>
                    </ProtectedRoute>
                }>
                </Route>


                {/* Admin routes */}
                // TODO: Add admin routes
                <Route element={
                    <ProtectedRoute allowedRoles={[AppRoles.Admin]}>
                        <OutletSwitcher/>
                    </ProtectedRoute>
                }>
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;

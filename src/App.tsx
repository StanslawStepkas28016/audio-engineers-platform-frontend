import {BrowserRouter, Route, Routes} from "react-router-dom";
import {LoginPage} from "@/pages/Guest/LoginPage.tsx";
import {RegisterPage} from "@/pages/Guest/RegisterPage.tsx";
import {VerifyAccountPage} from "@/pages/Guest/VerifyAccountPage.tsx";
import {useEffect} from "react";
import {useUserStore} from "@/stores/useUserStore.ts";
import {AddAdvert} from "@/pages/AudioEngineer/AddAdvert.tsx";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {SeeYourAdvert} from "@/pages/AudioEngineer/SeeYourAdvert.tsx";
import {DeleteAdvert} from "@/pages/AudioEngineer/DeleteAdvert.tsx";
import {EditAdvert} from "@/pages/AudioEngineer/EditAdvert.tsx";
import {SeeAdvert} from "@/pages/Shared/SeeAdvert.tsx";
import {ResetEmail} from "@/pages/Shared/ResetEmail.tsx";
import {VerifyResetEmailPage} from "@/pages/Shared/VerifyResetEmailPage.tsx";
import {OutletSwitcher, ProtectedRoute, RedirectAuthenticatedUser, ScrollToTop} from "@/hooks/routing-hooks.tsx";
import {GuestOutletWithoutSidebar} from "@/pages/Guest/GuestOutletWithoutSidebar.tsx";
import {AppRoles} from "@/enums/app-roles.tsx";
import {ResetPassword} from "@/pages/Shared/ResetPassword.tsx";
import {ResetPhoneNumber} from "@/pages/Shared/ResetPhoneNumber.tsx";
import {VerifyResetPasswordPage} from "@/pages/Shared/VerifyResetPasswordPage.tsx";
import {ForgotPasswordPage} from "@/pages/Guest/ForgotPasswordPage.tsx";
import {SeeAllAdverts} from "@/pages/Shared/SeeAllAdverts.tsx";
import {Chat} from "@/pages/Shared/Chat.tsx";
import {NotFoundPage} from "./pages/Guest/NotFoundPage";
import {Toaster} from "react-hot-toast";
import {VerifyForgotPasswordPage} from "@/pages/Guest/VerifyForgotPasswordPage.tsx";
import {useChatStore} from "@/stores/useChatStore.ts";
import {AdvertData} from "@/pages/Admin/AdvertData.tsx";
import {SeeGuide} from "@/pages/Shared/SeeGuide.tsx";

function App() {
    const {checkAuth, isCheckingAuth, isAuthenticated} = useUserStore();
    const {startHubConnection, subscribeToMessages, stopHubConnection} = useChatStore();

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            startHubConnection()
                    .then(() => subscribeToMessages());
        }

        return () => {
            stopHubConnection()
        };
    }, [isAuthenticated]);

    if (isCheckingAuth) {
        return <LoadingPage/>;
    }

    return (
            <BrowserRouter>
                <ScrollToTop/>
                <Routes>
                    {/* Shared routes */}
                    <Route path="*" element={<NotFoundPage/>}/>

                    <Route element={
                        <OutletSwitcher/>
                    }>
                        <Route index element={<SeeAllAdverts/>}/>
                        <Route path="see-guide" element={<SeeGuide/>}/>
                        <Route path="see-advert/:idAdvert" element={<SeeAdvert/>}/>
                    </Route>

                    {/* Guest routes */}
                    <Route element={
                        <RedirectAuthenticatedUser>
                            <GuestOutletWithoutSidebar/>
                        </RedirectAuthenticatedUser>
                    }>
                        <Route path="login" element={<LoginPage/>}/>
                        <Route path="register" element={<RegisterPage/>}/>
                        <Route path="forgot-password" element={<ForgotPasswordPage/>}/>
                        <Route path="verify-account" element={<VerifyAccountPage/>}/>
                        <Route path=":resetEmailToken/verify-reset-email" element={<VerifyResetEmailPage/>}/>
                        <Route path=":resetPasswordToken/verify-reset-password" element={<VerifyResetPasswordPage/>}/>
                        <Route path=":forgotPasswordToken/verify-forgot-password"
                               element={<VerifyForgotPasswordPage/>}/>
                    </Route>

                    {/* Shared protected routes */}
                    <Route element={
                        <ProtectedRoute
                                allowedRoles={[AppRoles.Client, AppRoles.Administrator, AppRoles.AudioEngineer]}>
                            <OutletSwitcher/>
                        </ProtectedRoute>
                    }>
                        <Route path="reset-email" element={<ResetEmail/>}/>
                        <Route path="reset-password" element={<ResetPassword/>}/>
                        <Route path="reset-phone-number" element={<ResetPhoneNumber/>}/>
                        <Route path="chat/:idUserRecipient" element={<Chat/>}/>
                    </Route>


                    {/* Audio engineer routes */}
                    <Route element={
                        <ProtectedRoute allowedRoles={[AppRoles.AudioEngineer]}>
                            <OutletSwitcher/>
                        </ProtectedRoute>
                    }>
                        <Route path="my-advert" element={<SeeYourAdvert/>}/>
                        <Route path="add-advert" element={<AddAdvert/>}/>
                        <Route path="edit-advert" element={<EditAdvert/>}/>
                        <Route path="delete-advert" element={<DeleteAdvert/>}/>
                    </Route>

                    {/* Admin routes */}
                    <Route element={
                        <ProtectedRoute allowedRoles={[AppRoles.Administrator]}>
                            <OutletSwitcher/>
                        </ProtectedRoute>
                    }>
                        <Route path="advert-data" element={<AdvertData/>}/>
                    </Route>
                </Routes>
                <Toaster position={"bottom-right"}/>
            </BrowserRouter>
    );
}

export default App;

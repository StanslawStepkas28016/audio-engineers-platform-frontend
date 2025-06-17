import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {Login} from "@/pages/Shared/Login.tsx";
import {AudioEngineerHomepage} from "@/pages/Engineer/AudioEngineerHomepage.tsx";
import {NotFound} from "@/pages/Shared/NotFound.tsx";
import {Register} from "@/pages/Shared/Register.tsx";
import {VerifyAccount} from "@/pages/Shared/VerifyAccount.tsx";
import React, {useEffect} from "react";
import {userStore} from "@/lib/userStore.ts";
import {AppRoles} from "@/shared/app-roles.tsx";
import {AudioEngineerAddAdvertPage} from "@/pages/Engineer/AudioEngineerAddAdvert.tsx";
import {Loading} from "@/pages/Shared/Loading.tsx";


const ProtectedRoute = ({children}: { children: React.ReactElement }) => {
    const {isLoggedIn} = userStore();

    if (!isLoggedIn) {
        return <Navigate to='/login' replace/>;
    }

    return children;
};

function App() {
    const {isCheckingAuth, checkAuth} = userStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) {
        return <Loading/>;
    }

    return (
        <Router>
            <Routes>
                <Route path="*" element={<NotFound/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/verify-account" element={<VerifyAccount/>}/>

                {/* Audio engineer routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <AudioEngineerHomepage/>
                    </ProtectedRoute>}
                />

                <Route path="/add-advert" element={
                    <ProtectedRoute>
                        <AudioEngineerAddAdvertPage/>
                    </ProtectedRoute>}
                />


                {/*Client routes*/}
                {/*Admin routes*/}
            </Routes>
        </Router>
    );
}

export default App;

import {LoginForm} from "@/components/forms/login-form.tsx";
import {axiosInstance} from "@/lib/axios.ts";
import {useState} from "react";
import {isAxiosError} from "axios";
import {GuestNavbar} from "@/components/ui/guest-navbar.tsx";

export interface LoginFormData {
    email: string,
    password: string
}

export const Login = () => {
    const [error, setError] = useState("");

    const handleLogin = async (data: LoginFormData) => {
        try {
            const response = await axiosInstance.post("auth/login",
                {
                    email: data.email,
                    password: data.password
                }
            );
            console.log(response);
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                const exceptionMessage = e.response.data.ExceptionMessage;
                setError(exceptionMessage);
            } else {
                console.log(e);
            }
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <GuestNavbar/>
            <main className="flex-1 flex w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm onSubmit={handleLogin} error={error}/>
                </div>
            </main>
        </div>
    );
}
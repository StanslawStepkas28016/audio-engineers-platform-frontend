import {axiosInstance} from "@/lib/axios.ts";
import {useState} from "react";
import {isAxiosError} from "axios";
import {RegisterForm} from "@/components/forms/register-form";
import {GuestNavbar} from "@/components/ui/guest-navbar.tsx";

export type RegisterFormData = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    roleName: string;
}

export const Register = () => {
    const [error, setError] = useState("");

    const handleRegister = async (data: RegisterFormData) => {
        setError("");
        console.log("register", data);

        try {
            const response = await axiosInstance.post("auth/register",
                {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    username: data.username,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    password: data.password,
                    roleName: data.roleName,
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
            <main className="flex-1 grid lg:grid-cols-2 overflow-hidden">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-xs">
                            <RegisterForm handleMethodDelegate={handleRegister} error={error}/>
                        </div>
                    </div>
                </div>
                <div className="relative hidden bg-muted lg:block">
                    <img
                        src="src/assets/pexels-photo-164938.jpeg"
                        alt="Image"
                        className="absolute  h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </main>
        </div>
    );
}
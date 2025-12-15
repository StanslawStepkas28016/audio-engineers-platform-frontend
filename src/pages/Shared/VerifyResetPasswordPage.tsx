import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {axiosInstance} from "@/lib/axios.ts";
import {Navbar} from "@/components/ui/navbar.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Terminal} from "lucide-react";

export const VerifyResetPasswordPage = () => {
    const {resetPasswordToken} = useParams<{ resetPasswordToken: string }>();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();


    const sendVerifyResetPasswordRequest = async () => {
        setError("");
        setSuccess("");

        await axiosInstance
            .post(`/auth/${resetPasswordToken}/verify-reset-password`)
            .then(() => {
                setSuccess("Successfully reset your password. Please log in again.");
                setTimeout(() => navigate("/"), 1000);
            })
            .catch(e => setError(e.response.data.ExceptionMessage || "Error while verifying password reset."));
    };

    return (
        <div>
            <Navbar/>
            <div className="p-10 md: h-screen flex flex-col items-center justify-center">
                <h1 className="m-5">
                    Please click the button bellow in order to reset your password.
                </h1>
                <Button onClick={sendVerifyResetPasswordRequest}>
                    Click here
                </Button>

                {error &&
                    <div className="p-10 md:w-xl">
                        <Alert variant="destructive" className="mt-5">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    </div>
                }

                {success && (
                    <Alert className="mt-5">
                        <Terminal className="h-4 w-4"/>
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            {success}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>);
}
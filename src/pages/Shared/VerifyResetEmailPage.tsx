import {Navbar} from "@/components/ui/navbar.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

export const VerifyResetEmailPage = () => {
    const {resetEmailToken} = useParams<{ resetEmailToken: string }>();
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const sendVerifyResetEmailRequest = async () => {
        try {
            await axiosInstance.post(`/auth/${resetEmailToken}/verify-reset-email`);
            alert("Successfully reset your email. Please log in again.");
            navigate("/login");
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                setError(e.response.data.ExceptionMessage);
            } else {
                console.log(e);
            }
        }
    };

    return (
        <div>
            <Navbar/>
            <div className="p-10 md: h-screen flex flex-col items-center justify-center">
                <h1 className="mb-10">
                    Please click the button below to verify your new email!
                </h1>

                <Button className="-mb-5" onClick={sendVerifyResetEmailRequest}>
                    Click here to approve email reset
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
            </div>
        </div>
    );
}
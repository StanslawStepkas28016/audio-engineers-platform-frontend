import {Navbar} from "@/components/ui/navbar.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {axiosInstance} from "@/lib/axios.ts";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Terminal} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

export const VerifyResetEmailPage = () => {
    const {resetEmailToken} = useParams<{ resetEmailToken: string }>();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        await axiosInstance
            .post(`/auth/${resetEmailToken}/verify-reset-email`)
            .then(() => {
                setSuccess("Successfully reset your email. Please log in again.");
                setTimeout(() => navigate("/login"), 1000);
            })
            .catch(e => setError(e.response.data.ExceptionMessage || "Error verifying email reset."));
    };

    return (
        <div>
            <Navbar/>
            <div className="p-10 md: h-screen flex flex-col items-center justify-center">
                <h1 className="m-5">
                    Please click the button bellow in order to reset your email.
                </h1>
                <Button onClick={handleSubmit}>
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
                    <div className="p-10 md:w-xl">
                        <Alert className="mt-5">
                            <Terminal className="h-4 w-4"/>
                            <AlertTitle>Heads up!</AlertTitle>
                            <AlertDescription>
                                {success}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>
        </div>
    );
}
import {Navbar} from "@/components/ui/navbar.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {axiosInstance} from "@/lib/axios.ts";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Terminal} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";

export const VerifyResetEmailPage = () => {
    const {t} = useTranslation();

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
                    setSuccess((t("Shared.VerifyResetEmail.success")));
                    setTimeout(() => navigate("/login"), 1000);
                })
                .catch(() => setError(t("Shared.VerifyResetEmail.error")));
    };

    return (
            <div>
                <Navbar/>
                <div className="p-10 md: h-screen flex flex-col items-center justify-center align-middle ">
                    <h1 className="md:text-2xl sm:text-xl whitespace-pre-line m-5 text-center">
                        {t("Shared.VerifyResetEmail.info")}
                    </h1>
                    <Button onClick={handleSubmit}>
                        {t("Common.click")}
                    </Button>

                    {error &&
                        <div>
                            <Alert variant="destructive" className="mt-5">
                                <AlertCircle className="h-4 w-4"/>
                                <AlertTitle>{t("Common.error")}</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        </div>
                    }

                    {success && (
                            <div>
                                <Alert className="mt-5">
                                    <Terminal className="h-4 w-4"/>
                                    <AlertTitle>{t("Common.success")}</AlertTitle>
                                    <AlertDescription className="whitespace-pre-line">
                                        {success}
                                    </AlertDescription>
                                </Alert>
                            </div>
                    )}
                </div>
            </div>
    );
}
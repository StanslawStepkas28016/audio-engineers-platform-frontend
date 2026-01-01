import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {axiosInstance} from "@/lib/axios.ts";
import {Navbar} from "@/components/ui/navbar.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Terminal} from "lucide-react";
import {useTranslation} from "react-i18next";

export const VerifyResetPasswordPage = () => {
    const {t} = useTranslation();

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
                    setSuccess(t("Shared.VerifyResetPassword.success"));
                    setTimeout(() => navigate("/"), 1000);
                })
                .catch(() => t("Shared.VerifyResetPassword.error"));
    };

    return (
            <div>
                <Navbar/>
                <div className="p-10 md: h-screen flex flex-col items-center justify-center">
                    <h1 className="md:text-2xl sm:text-xl whitespace-pre-line m-5 text-center">
                        {t("Shared.VerifyResetPassword.info")}
                    </h1>
                    <Button onClick={sendVerifyResetPasswordRequest}>
                        {t("Common.click")}
                    </Button>

                    <div>
                        {error &&
                            <Alert variant="destructive" className="mt-5">
                                <AlertCircle className="h-4 w-4"/>
                                <AlertTitle>{t("Common.error")}</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        }

                        {success && (
                                <Alert className="mt-5">
                                    <Terminal className="h-4 w-4"/>
                                    <AlertTitle>{t("Common.success")}</AlertTitle>
                                    <AlertDescription className="whitespace-pre-line">
                                        {t("Shared.VerifyResetPassword.success")}
                                    </AlertDescription>
                                </Alert>
                        )}
                    </div>

                </div>
            </div>);
}
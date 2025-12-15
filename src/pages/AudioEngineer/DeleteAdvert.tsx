import {axiosInstance} from "@/lib/axios.ts";
import {useUserStore} from "@/stores/useUserStore.ts";
import {useState} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, InfoIcon, Terminal} from "lucide-react";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Button} from "@/components/ui/button"
import {useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

export const DeleteAdvert = () => {
    const {t} = useTranslation();

    const {userData} = useUserStore();
    const navigate = useNavigate();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [noAdvertPostedError, setNoAdvertPostedError] = useState("");

    const {data: idAdvert, isLoading} = useQuery(
            {
                queryFn: async () => await axiosInstance
                        .get(`/advert/${userData.idUser}/id-advert`)
                        .then(r => r.data.idAdvert)
                        .catch(() => setNoAdvertPostedError(t("AudioEngineer.DeleteAdvert.error-no-advert-posted"))),
                queryKey: ['getIdAdvertByIdUserForDelete', userData.idUser]
            }
    );

    const handleSubmit = async () => {
        setError("");

        await axiosInstance.delete(`/advert/${idAdvert}`, {
            data: {
                idUser: userData.idUser
            }
        })
                .then(
                        () => {
                            setSuccess(t("AudioEngineer.DeleteAdvert.success"));
                            setTimeout(() => navigate("/"), 1000);
                        })
                .catch(() => setError(t("AudioEngineer.DeleteAdvert.error-fallback")));
    }

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (
            <>
                {noAdvertPostedError ? (
                        <div className="w-full p-5">
                            <Alert variant="default">
                                <InfoIcon className="h-4 w-4"/>
                                <AlertTitle>{t("Common.info")}</AlertTitle>
                                <AlertDescription>
                                    {noAdvertPostedError}
                                </AlertDescription>
                            </Alert>
                        </div>
                ):(
                        <div className="p-10 md: flex flex-col h-full justify-center">
                            <div className="p-10 flex flex-col items-center">
                                <h1 className="text-3xl font-bold mb-10 text-center">
                                    {t("AudioEngineer.DeleteAdvert.title")}
                                </h1>

                                <img
                                        src="/src/assets/sad_face.png"
                                        alt="decoration"
                                        width={200} height={200}
                                        className="object-contain filter dark:invert mb-10"
                                />

                                <div className="mb-10">
                                    <p className="text-center whitespace-pre-line">
                                        {t("AudioEngineer.DeleteAdvert.description")}
                                    </p>
                                </div>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button>
                                            {t("AudioEngineer.DeleteAdvert.delete")}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>{t("AudioEngineer.DeleteAdvert.absolutely-sure")}</AlertDialogTitle>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>{t("Common.cancel")}</AlertDialogCancel>
                                            <AlertDialogAction
                                                    onClick={() => handleSubmit()}>{t("Common.continue")}</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <div className="w-full mt-10">
                                    {success && (
                                            <Alert>
                                                <Terminal className="h-4 w-4"/>
                                                <AlertTitle>{t("Common.success")}</AlertTitle>
                                                <AlertDescription>
                                                    {success}
                                                </AlertDescription>
                                            </Alert>
                                    )}
                                    {error && (
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4"/>
                                                <AlertTitle>{t("Common.error")}</AlertTitle>
                                                <AlertDescription>
                                                    {error}
                                                </AlertDescription>
                                            </Alert>
                                    )}
                                </div>

                            </div>
                        </div>

                )}
            </>
    );
}
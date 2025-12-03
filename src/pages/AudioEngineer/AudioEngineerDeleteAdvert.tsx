import {axiosInstance} from "@/lib/axios.ts";
import {useUserStore} from "@/stores/useUserStore.ts";
import {useState} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Terminal} from "lucide-react";
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

export const AudioEngineerDeleteAdvert = () => {
    const {userData} = useUserStore();
    const navigate = useNavigate();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [noAdvertPostedError, setNoAdvertPostedError] = useState(false);

    const {data: idAdvert, isLoading} = useQuery(
        {
            queryFn: async () => await axiosInstance
                .get(`/advert/${userData.idUser}/id-advert`)
                .then(r => r.data.idAdvert)
                .catch(e => setNoAdvertPostedError(e.response.data.ExceptionMessage || "Error loading advert related data.")),
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
                    setSuccess("Successfully updated your advert!");
                    setTimeout(() => navigate("/"), 1000);
                })
            .catch(r => setError(r.response.data.ExceptionMessage || "Error deleting advert."));
    }

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (
        <>
            {noAdvertPostedError ? (
                <div className="w-full p-5">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {noAdvertPostedError}
                        </AlertDescription>
                    </Alert>
                </div>
            ) : (
                <div className="p-10 md: flex flex-col h-full justify-center">
                    <div className="p-10 flex flex-col items-center">
                        <h1 className="text-3xl font-bold mb-10 text-center">
                            You are about to deletes your advert!
                        </h1>

                        <img
                            src="/src/assets/sad_face.png"
                            alt="decoration"
                            width={200} height={200}
                            className="object-contain filter dark:invert mb-10"
                        />

                        <div className="mb-10">
                            <p className="text-center">
                                By deleting your advert, you will no longer be able to receive requests from clients.
                            </p>
                            <p className="text-center">
                                If you want to keep receiving requests, you can simply edit your advert instead of
                                deleting
                                it!
                            </p>
                        </div>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button>
                                    Delete my advert
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleSubmit()}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <div className="w-full mt-10">
                            {success && (
                                <Alert>
                                    <Terminal className="h-4 w-4"/>
                                    <AlertTitle>Heads up!</AlertTitle>
                                    <AlertDescription>
                                        {success}
                                    </AlertDescription>
                                </Alert>
                            )}
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4"/>
                                    <AlertTitle>Error</AlertTitle>
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
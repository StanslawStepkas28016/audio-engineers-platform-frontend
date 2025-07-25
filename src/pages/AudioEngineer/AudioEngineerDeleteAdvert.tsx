import {axiosInstance} from "@/lib/axios.ts";
import {userStore} from "@/lib/userStore";
import {useEffect, useState} from "react";
import {isAxiosError} from "axios";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from "lucide-react";
import {LoadingPage} from "@/pages/Shared/LoadingPage.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Button} from "@/components/ui/button"

export const AudioEngineerDeleteAdvert = () => {
    const {userData} = userStore();
    const [idAdvertBasedOnIdUser, setIdAdvertBasedOnIdUser] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [noAdvertPostedError, setNoAdvertPostedError] = useState(false);

    const getAdvertIdAdvertBasedOnIdUser = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/advert/${userData.idUser}/id-advert`);
            setIdAdvertBasedOnIdUser(response.data);
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                if (e.response.status === 500) {
                    setNoAdvertPostedError(e.response.data.ExceptionMessage);
                } else {
                    setError(e.response.data.ExceptionMessage);
                }
            } else {
                console.log(e);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const sendDeleteRequest = async () => {
        try {
            const response = await axiosInstance.delete(`/advert/${idAdvertBasedOnIdUser}`);
            console.log(response.data)
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                setError(e.response.data.ExceptionMessage);
            }
        }
    }

    useEffect(() => {
        getAdvertIdAdvertBasedOnIdUser();
    }, [])

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (
        <div className="flex flex-col items-center justify-center p-10">
            <h1 className="text-3xl font-bold mb-10">
                You are about to remove your advert!
            </h1>
            {noAdvertPostedError ? (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {noAdvertPostedError}
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <img
                        src="/src/assets/sad_face.jpg"
                        alt="decoration"
                        width={200} height={200}
                        className="object-contain filter dark:invert mb-10"
                    />
                    <div className="mb-10">
                        <p className="text-center">
                            By deleting your advert, you will no longer be able to receive requests from clients.
                        </p>
                        <p className="text-center">
                            If you want to keep receiving requests, you can simply edit your advert instead of deleting
                            it.
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
                                <AlertDialogDescription>
                                    When you delete your advert, there is no going back. Please be certain.
                                    Please consider editing your advert instead of deleting it if you want to keep
                                    receiving requests from your clients.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => sendDeleteRequest()}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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
            )}
        </div>
    );
}
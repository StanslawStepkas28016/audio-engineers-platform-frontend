import {axiosInstance} from "@/lib/axios.ts";
import {userStore} from "@/lib/userStore";
import {useEffect, useState} from "react";
import {isAxiosError} from "axios";
import {AdvertData} from "@/pages/Shared/SeeAdvert.tsx";
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
import { Button } from "@/components/ui/button"

export const AudioEngineerDeleteAdvert = () => {
    const {userData} = userStore();
    const [advertData, setAdvertData] = useState<AdvertData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [noAdvertPostedError, setNoAdvertPostedError] = useState(false);

    const getAdvertSummaryData = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/advert/by-id-user/${userData.idUser}`);
            setAdvertData(response.data);
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

    useEffect(() => {
        getAdvertSummaryData();
    }, [])

    const sendDeleteRequest = async () => {
        setSuccess("Successfully deleted your advert!");
    }

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (
        <div className="flex flex-col items-center justify-center p-10">
            <h1 className="text-3xl font-bold mb-10">You are about to remove your advert</h1>
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
                    <p className="justify-center mb-10">
                        By deleting your advert, you will no longer be able to receive requests from clients.
                        If you want to keep receiving requests, you can simply edit your advert instead of deleting it.
                    </p>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button onClick={() => sendDeleteRequest()}>
                                Delete my advert
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Continue</AlertDialogAction>
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
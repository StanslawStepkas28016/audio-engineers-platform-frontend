import {useUserStore} from "@/stores/useUserStore.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from "lucide-react";

export const AudioEngineerSeeYourAdvert = () => {
    const {userData} = useUserStore();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [noAdvertPostedError, setNoAdvertPostedError] = useState(false);

    const navigate = useNavigate();

    const getAdvertIdAdvertBasedOnIdUser = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/advert/id-advert/${userData.idUser}`);
            navigate(`/see-advert/${response.data}`);
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
    };

    useEffect(() => {
        getAdvertIdAdvertBasedOnIdUser();
    }, []);

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (<div className="p-5">
        {
            noAdvertPostedError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {noAdvertPostedError}
                    </AlertDescription>
                </Alert>
            )
        }
        {
            error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )
        }
    </div>);
}
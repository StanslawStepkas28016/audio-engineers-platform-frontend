import {useUserStore} from "@/stores/useUserStore.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {axiosInstance} from "@/lib/axios.ts";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from "lucide-react";
import {useQuery} from "@tanstack/react-query";

export const AudioEngineerSeeYourAdvert = () => {
    const navigate = useNavigate();
    const {userData} = useUserStore();
    const [error, setError] = useState("");

    const {isLoading: isLoadingIdAdvert} = useQuery(
        {
            queryFn: async () => await axiosInstance
                .get(`/advert/${userData.idUser}/id-advert`)
                .then(r => {
                    navigate(`/see-advert/${r.data.idAdvert}`);
                })
                .catch(e => setError(e.response.data.ExceptionMessage || "Error loading advert data."))
        }
    );

    if (isLoadingIdAdvert) {
        return <LoadingPage/>;
    }

    return (<div className="p-5">
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
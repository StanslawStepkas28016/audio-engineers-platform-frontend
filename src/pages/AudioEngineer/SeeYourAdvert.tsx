import {useUserStore} from "@/stores/useUserStore.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {axiosInstance} from "@/lib/axios.ts";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {InfoIcon} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";

export const SeeYourAdvert = () => {
    const {t} = useTranslation();

    const navigate = useNavigate();
    const {userData} = useUserStore();
    const [error, setError] = useState("");

    const {isLoading: isLoadingIdAdvert} = useQuery({
        queryFn: async () => await axiosInstance
                .get(`/advert/${userData.idUser}/id-advert`)
                .then(r => {
                    navigate(`/see-advert/${r.data.idAdvert}`);
                })
                .catch(e => {
                    let key = "AudioEngineer.SeeYourAdvert.error-fallback";

                    const exceptionMessage = e.response.data.ExceptionMessage.toLowerCase();

                    if (exceptionMessage.includes("not posted")) {
                        key = "AudioEngineer.SeeYourAdvert.error-advert-not-posted";
                    }

                    setError(t(key));
                }),
        queryKey: ['audio-engineer-see-your-advert', userData.idUser]
    });

    if (isLoadingIdAdvert) {
        return <LoadingPage/>;
    }

    return (<div className="p-5">
        {
                error && (
                        <Alert variant="default">
                            <InfoIcon className="h-4 w-4"/>
                            <AlertTitle>{t("Common.info")}</AlertTitle>
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                )
        }
    </div>);
}
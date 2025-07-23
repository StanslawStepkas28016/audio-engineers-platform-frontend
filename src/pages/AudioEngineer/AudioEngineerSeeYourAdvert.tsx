import {userStore} from "@/lib/userStore.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";
import {LoadingPage} from "@/pages/Shared/LoadingPage.tsx";

export const AudioEngineerSeeYourAdvert = () => {
    const {userData} = userStore();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [noAdvertPostedError, setNoAdvertPostedError] = useState(false);

    const navigate = useNavigate();

    const getAdvertIdAdvertBasedOnIdUser = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/advert/${userData.idUser}/id-advert`);
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
    }

    useEffect(() => {
        getAdvertIdAdvertBasedOnIdUser();
    }, []);

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (<div>
        (error || noAdvertPostedError) &&
        {
            <h1>
                {error}{noAdvertPostedError}
            </h1>
        }
    </div>);
}
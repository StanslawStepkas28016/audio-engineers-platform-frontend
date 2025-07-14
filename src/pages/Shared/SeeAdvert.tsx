import {axiosInstance} from "@/lib/axios.ts";
import {useEffect, useState} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Facebook, HandCoins, Instagram, Linkedin} from "lucide-react";
import {isAxiosError} from "axios";
import {transformDate, transformPlaylistUrlToEmbedUrl} from "@/hooks/utils.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {LoadingPage} from "@/pages/Shared/LoadingPage.tsx";
import {useParams} from "react-router-dom";
import {formatDistanceToNow} from "date-fns";

export type AdvertData = {
    idUser: string,
    idAdvert: string,
    title: string,
    description: string,
    price: string,
    categoryName: string,
    coverImageUrl: string,
    portfolioUrl: string,
    userFirstName: string,
    userLastName: string,
    dateCreated: Date,
    dateModified: Date,
}

export type SingleReviewData = {
    idAdvert: string,
    clientFirstName: string,
    clientLastName: string,
    content: string,
    satisfactionLevel: number,
    dateCreated: Date,
    calculatedMonthsAgo: number,
}

export type AdvertReviewsData = {
    items: SingleReviewData[];
    page: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export const SeeAdvert = () => {
    const {idAdvert} = useParams<{ idAdvert: string }>();

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [noAdvertPostedError, setNoAdvertPostedError] = useState("");
    const [advertData, setAdvertData] = useState<AdvertData | null>(null);
    const [advertReviews, setAdvertReviews] = useState<AdvertReviewsData | null>(null);


    const fetchUserAdvert = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(`/advert/${idAdvert}`);
            setAdvertData(response.data);
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                if (e.response.status === 500) {
                    setNoAdvertPostedError(e.response.data.ExceptionMessage);
                    console.log(e)
                } else {
                    setError(e.response.data.ExceptionMessage);
                }
            } else {
                console.log(e)
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAdvertReviews = async () => {
        try {
            const response = await axiosInstance.get(`/advert/reviews`, {
                params: {
                    idAdvert: idAdvert,
                    page: 1,
                    pageSize: 4
                }
            });
            setAdvertReviews(response.data);
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                if (e.response.status === 500) {
                    setNoAdvertPostedError(e.response.data.ExceptionMessage);
                    console.log(e)
                } else {
                    setError(e.response.data.ExceptionMessage);
                }
            } else {
                console.log(e)
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserAdvert();
        fetchAdvertReviews();
    }, [idAdvert])

    if (isLoading) {
        return <LoadingPage/>;
    }
    return (
        <div className="flex flex-col items-center p-10">
            {noAdvertPostedError ? (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {noAdvertPostedError}
                    </AlertDescription>
                </Alert>
            ) : (
                advertData && (
                    <div className="justify-center text-center">
                        <h1 className="text-3xl font-bold">{advertData.title}</h1>

                        <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {advertData.userFirstName} {advertData.userLastName} | {transformDate(advertData.dateCreated)}
                        </p>

                        <p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">{advertData.description}</p>

                        <Card className="mt-10">
                            <CardHeader>
                                <CardTitle className="text-3xl font-bold">Prices starting from:</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-row gap-4 items-center justify-center">
                                    <HandCoins size={100} strokeWidth={1}/>
                                    <p className="text-2xl ">{advertData.price} <b>PLN</b></p>
                                </div>
                                <p className="mt-5">
                                    This is a price for per one <b>{advertData.categoryName}</b> inquiry!
                                </p>
                            </CardContent>
                        </Card>

                        <iframe
                            src={transformPlaylistUrlToEmbedUrl(advertData.portfolioUrl)}
                            className="mt-10 w-full"
                            height="400"
                        />

                        <h1 className="text-3xl font-bold mt-10 mb-10">Want to collaborate?</h1>
                        <div className="flex flex-row gap-4 items-center justify-center">
                            <a href="https://www.instagram.com" target="_blank"><Instagram size={50}
                                                                                           strokeWidth={2}/></a>
                            <a href="https://www.instagram.com" target="_blank"><Facebook size={50}
                                                                                          strokeWidth={2}/></a>
                            <a href="https://www.instagram.com" target="_blank"><Linkedin size={50}
                                                                                          strokeWidth={2}/></a>
                        </div>

                        <h1 className="text-3xl font-bold m-10">See my reviews!</h1>

                        {
                            advertReviews?.items?.map((reviewData: SingleReviewData) => (
                                <div key={reviewData.idAdvert} className="my-5">
                                    <Card>
                                        <CardHeader className="">
                                            <div className="flex justify-between">
                                                <CardTitle
                                                    className="text-1xl">{reviewData.clientFirstName} {reviewData.clientLastName}</CardTitle>
                                            </div>
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>Client</span>
                                                <span>{formatDistanceToNow(new Date(reviewData.dateCreated), {addSuffix: true})}</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-2">
                                            <p className="text-justify">
                                                {reviewData.content}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))
                        }

                    </div>)
            )}
            {error &&
                <Alert variant="destructive" className="mt-5">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            }
        </div>
    );
}
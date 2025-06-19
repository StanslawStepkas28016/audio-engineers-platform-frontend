import {useEffect, useState} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from "lucide-react";
import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";
import {LoadingPage} from "@/pages/Shared/LoadingPage.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {transformDate} from "@/lib/utils.ts";

export type SingleAdvertOverviewData = {
    title: string,
    price: string,
    categoryName: string,
    userFirstName: string,
    userLastName: string,
    dateCreated: Date,
    coverImageKey: string,
    coverImageUrl: string,
}

export type AdvertsData = {
    items: SingleAdvertOverviewData[];
    page: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export const AudioEngineerSeeAllAdverts = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [advertData, setAdvertData] = useState<AdvertsData | null>(null);

    const fetchAdverts = async () => {
        setError("");
        setLoading(true);
        try {
            const response = await axiosInstance.get("advert/get-all", {
                params: {sortOrder: "price_desc", page: 1, pageSize: 3},
            });
            setAdvertData(response.data);
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                setError(e.response.data.ExceptionMessage);
            } else {
                console.log(e)
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdverts()
    }, [])

    if (loading) {
        return <LoadingPage/>;
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mt-5">Find the best audio engineers!</h1>

            {advertData?.items?.map((advert: SingleAdvertOverviewData) => (
                <div key={advert.title}>
                    <Card className="my-10">
                        <CardHeader className="">
                            <div className="flex justify-between">
                                <CardTitle className="text-4xl">{advert.title}</CardTitle>
                            </div>
                            <div className="flex justify-between text-4l text-muted-foreground">
                                <span>{advert.userFirstName} {advert.userLastName} | {transformDate(advert.dateCreated)}</span>
                            </div>
                            {/*<img
                            src={advert.coverImageUrl}
                            alt="decoration"
                            className="object-contain filter dark:invert"
                        />*/}
                        </CardHeader>
                        <CardContent className="text-1l">
                            <p className="text-justify">
                                My experience working with this guy was great! I really liked how passionate he was
                                about making minor adjustments to a song he mixed for me :)
                            </p>
                        </CardContent>
                    </Card>
                </div>
            ))}

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
    );
}
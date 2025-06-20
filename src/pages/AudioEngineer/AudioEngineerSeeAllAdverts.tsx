import {useEffect, useState} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, WalletIcon} from "lucide-react";
import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";
import {LoadingPage} from "@/pages/Shared/LoadingPage.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {transformDate} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";

export type SingleAdvertOverviewData = {
    title: string,
    price: string,
    categoryName: string,
    userFirstName: string,
    userLastName: string,
    dateCreated: Date,
    // coverImageKey: string,
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
                        <CardHeader>
                            <CardTitle className="text-4xl">{advert.title}</CardTitle>
                        </CardHeader>

                        <CardContent className="grid gap-3 md:grid-cols-2">
                            <div>
                                <p
                                    className="text-4l text-muted-foreground">{advert.userFirstName} {advert.userLastName} | {transformDate(advert.dateCreated)}
                                </p>

                                <Card className="p-10 mt-5">
                                    <div className="flex justify-between">
                                        <h1>
                                            Prices from:
                                            <p className="text-5xl">{advert.price} PLN</p>
                                        </h1>
                                        <WalletIcon className="ml-5" absoluteStrokeWidth={true} size={90}></WalletIcon>
                                    </div>
                                </Card>

                            </div>

                            <img
                                src={advert.coverImageUrl}
                                alt="decoration"
                                className=""
                            />
                        </CardContent>
                        <Button className="">See more</Button>
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
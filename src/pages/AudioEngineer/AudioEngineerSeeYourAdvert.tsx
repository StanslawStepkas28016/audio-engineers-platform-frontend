import {axiosInstance} from "@/lib/axios.ts";
import {useEffect, useState} from "react";
import {userStore} from "@/lib/userStore.ts";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Facebook, HandCoins, Instagram, Linkedin} from "lucide-react";
import {isAxiosError} from "axios";
import {transformDate, transformPlaylistUrlToEmbedUrl} from "@/lib/utils.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

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

export const AudioEngineerSeeYourAdvert = () => {
    const [error, setError] = useState("");
    const [advertData, setAdvertData] = useState<AdvertData | null>(null);
    const {userData} = userStore();

    const fetchUserAdvert = async () => {
        try {
            const response = await axiosInstance.get("advert", {params: {idUser: userData.idUser}});
            setAdvertData(response.data);
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                setError(e.response.data.ExceptionMessage);
            } else {
                console.log(e)
            }
        }
    };

    useEffect(() => {
        fetchUserAdvert();
    }, [])

    return (
        <div className="flex flex-col items-center justify-center mb-10">
            <div className="text-center mt-5 -mb-10 px-50">
                {
                    advertData && (
                        <div>
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

                            <h1 className="text-3xl font-bold mt-10">See my reviews!</h1>

                            <Card className="my-10">
                                <CardHeader className="">
                                    <div className="flex justify-between">
                                        <CardTitle className="text-1xl">William Smith</CardTitle>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Client</span>
                                        <span>8 months ago</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <p className="text-justify">
                                        My experience working with this guy was great! I really liked how passionate he was
                                        about making minor adjustments to a song he mixed for me :)
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="my-10">
                                <CardHeader className="">
                                    <div className="flex justify-between">
                                        <CardTitle className="text-1xl">Anna Doe</CardTitle>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Client</span>
                                        <span>12 months ago</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <p className="text-justify">
                                        My experience working with this guy was great! I really liked how passionate he was
                                        about making minor adjustments to a song he mixed for me :)
                                    </p>
                                </CardContent>
                            </Card>

                        </div>
                    )
                }
            </div>
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
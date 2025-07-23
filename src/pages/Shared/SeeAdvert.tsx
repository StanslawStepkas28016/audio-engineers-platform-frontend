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
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import {AutosizeTextarea} from "@/components/ui/autosize-textarea.tsx";
import {AppRoles} from "@/enums/app-roles.tsx";
import {userStore} from "@/lib/userStore.ts";
import {Rating} from "@/components/ui/rating.tsx";

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
    const {userData} = userStore();

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
            setIsLoading(true);
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

    const formValidationSchema = z.object({
        content: z
            .string()
            .min(35, {message: "Content must be at least 35 characters"})
            .max(1500, {message: "Content must be less than 1500 characters"}),
        satisfactionLevel: z
            .number()
            .min(1, {message: "SatisfactionLevel must be at least 1"})
            .max(5, {message: "SatisfactionLevel must be at most 5"}),
    });

    const form = useForm<z.infer<typeof formValidationSchema>>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            content: "",
            satisfactionLevel: 3,
        },
    });

    const handleAddReview = async () => {
        setError("");

        console.log(form.getValues().satisfactionLevel);

        try {
            setIsLoading(true);

            const response = await axiosInstance.post(`/advert/review`, {
                idAdvert: idAdvert,
                content: form.getValues().content,
                satisfactionLevel: form.getValues().satisfactionLevel,
            });

            console.log(response.data);
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                setError(e.response.data.ExceptionMessage);
            }
        } finally {
            setIsLoading(false);
        }

        form.reset();
    }

    useEffect(() => {
        fetchUserAdvert();
        fetchAdvertReviews();
    }, [idAdvert]);

    useEffect(() => {
        fetchAdvertReviews();
    }, [form.formState.isSubmitSuccessful]);

    if (isLoading) {
        return <LoadingPage/>;
    }
    return (
        <div className="flex flex-col items-center ">
            {noAdvertPostedError ? (
                <div className="w-full p-5">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {noAdvertPostedError}
                        </AlertDescription>
                    </Alert>
                </div>
            ) : (
                advertData && (
                    <div className="justify-center text-center">
                        <h1 className="text-xl md:text-2xl lg:text-3xl mt-10 font-bold">
                            {advertData.title}
                        </h1>

                        <p className="mt-5">
                            {advertData.userFirstName} {advertData.userLastName} | {transformDate(advertData.dateCreated)}
                        </p>

                        <p className="text-base/7 text-justify p-5">
                            {advertData.description}
                        </p>

                        <div className="p-5">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Prices starting from:</CardTitle>
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
                        </div>

                        <div className="flex justify-center align-middle">
                            <iframe
                                src={transformPlaylistUrlToEmbedUrl(advertData.portfolioUrl)}
                                className="w-full p-5"
                                height="400"
                            />
                        </div>

                        <h1 className="text-xl md:text-2xl lg:text-3xl m-10 font-bold">
                            Want to collaborate?
                        </h1>

                        <div className="flex flex-row gap-4 items-center justify-center">
                            <a href="https://www.instagram.com" target="_blank">
                                <Instagram size={50} strokeWidth={2}/>
                            </a>
                            <a href="https://www.instagram.com" target="_blank">
                                <Facebook size={50} strokeWidth={2}/>
                            </a>
                            <a href="https://www.instagram.com" target="_blank">
                                <Linkedin size={50} strokeWidth={2}/>
                            </a>
                        </div>

                        <h1 className="text-xl md:text-2xl lg:text-3xl mt-10 mb-5 font-bold">
                            See my reviews!
                        </h1>

                        {/* Displaying all reviews */}
                        {
                            (advertReviews?.items && advertReviews.items.length > 0) ?
                                advertReviews.items?.map((reviewData: SingleReviewData) => (
                                    <div key={reviewData.idAdvert} className="p-5 flex justify-center">
                                        <Card className="w-xs md:w-full">
                                            <CardHeader>
                                                <div className="flex justify-between">
                                                    <span>
                                                        {reviewData.clientFirstName} {reviewData.clientLastName}
                                                    </span>
                                                    <span>
                                                        <Rating value={reviewData.satisfactionLevel}
                                                                changeable={false}/>
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm text-muted-foreground">
                                                    <span>
                                                        {AppRoles.Client}
                                                    </span>
                                                    <span>
                                                        {formatDistanceToNow(new Date(reviewData.dateCreated), {addSuffix: true})}
                                                    </span>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-base text-justify wrap-break-word">
                                                    {reviewData.content}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )) : (
                                    <div>
                                        <p>No reviews yet, be the first one to post!</p>
                                    </div>
                                )
                        }

                        {/* Form for adding a review */}
                        {
                            userData.roleName == AppRoles.Client &&
                            (<div className="flex justify-center p-10">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleAddReview)} className="w-xs md:w-full ">
                                        <FormLabel className="mb-3">Share your own experience with this engineer!
                                        </FormLabel>

                                        <FormField
                                            control={form.control}
                                            name="satisfactionLevel"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Rating
                                                            value={field.value}
                                                            changeable={true}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="mt-5"/>
                                                </FormItem>
                                            )}
                                        />

                                        <div className="mt-3"/>

                                        <FormField
                                            control={form.control}
                                            name="content"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <AutosizeTextarea
                                                            placeholder="e.g Working with this engineer was great.."
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="mt-5"/>
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" className="w-full max-w-1xl mt-5">
                                            Submit
                                        </Button>
                                    </form>
                                </Form>
                            </div>)
                        }
                    </div>)
            )}
            {error &&
                <div className="w-full p-5">
                    <Alert variant="destructive" className="mt-5">

                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                </div>
            }
        </div>
    );
}

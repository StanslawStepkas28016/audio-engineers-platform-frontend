import {axiosInstance} from "@/lib/axios.ts";
import {useState} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Facebook, HandCoins, Instagram, Linkedin} from "lucide-react";
import {isAxiosError} from "axios";
import {transformDateAdvertCreated, transformPlaylistUrlToEmbedUrl} from "@/lib/utils.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {useNavigate, useParams} from "react-router-dom";
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
import {useUserStore} from "@/stores/useUserStore.ts";
import {Rating} from "@/components/ui/rating.tsx";
import {useQuery} from "react-query";
import {useErrorBoundary} from "react-error-boundary";

export type Advert = {
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

export type Review = {
    idReview: string,
    clientFirstName: string,
    clientLastName: string,
    content: string,
    satisfactionLevel: number,
    dateCreated: Date,
}

export type Reviews = {
    items: Review[],
    page: number,
    pageSize: number,
    totalCount: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
}

export const SeeAdvert = () => {
    const {idAdvert} = useParams<{ idAdvert: string }>();
    const {userData, isAuthenticated} = useUserStore();
    const navigate = useNavigate();

    const {showBoundary} = useErrorBoundary();
    const [error, setError] = useState("");
    const [noAdvertPostedError, setNoAdvertPostedError] = useState("");

    const fetchUserAdvert = async (): Promise<Advert | undefined> => {
        setNoAdvertPostedError("");

        try {
            const response = await axiosInstance.get(`/advert/${idAdvert}/details`);
            return response.data as Advert;
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                if (e.response.status === 500) {
                    setNoAdvertPostedError(e.response.data.ExceptionMessage);
                    console.log(e)
                } else {
                    showBoundary(e.response.data.ExceptionMessage);
                }
            }
        }
    };

    const fetchAdvertReviews = async (): Promise<Reviews | undefined> => {
        setNoAdvertPostedError("");

        try {
            const response = await axiosInstance.get(`/advert/${idAdvert}/reviews`, {
                params: {
                    page: 1,
                    pageSize: 4
                }
            });
            return response.data as Reviews;
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                if (e.response.status === 500) {
                    setNoAdvertPostedError(e.response.data.ExceptionMessage);
                } else {
                    showBoundary(e.response.data.ExceptionMessage);
                }
            }
        }
    };

    const {data: advert, isLoading: isLoadingAdvert} = useQuery(
        {
            queryFn: fetchUserAdvert,
            queryKey: ['fetchUserAdvert', {idAdvert}]
        }
    );

    const {data: reviews, isLoading: isLoadingReviews, refetch: refetchReviews} = useQuery(
        {
            queryFn: fetchAdvertReviews,
            queryKey: ['fetchAdvertReviews', {idAdvert}]
        }
    );

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

        try {
            await axiosInstance.post(`/advert/${idAdvert}/review`, {
                content: form.getValues().content,
                satisfactionLevel: form.getValues().satisfactionLevel,
            });

            await fetchAdvertReviews();

            form.reset();
            await refetchReviews();
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                setError(e.response.data.ExceptionMessage);
            }
        }
    }

    if (isLoadingAdvert || isLoadingReviews) {
        return <LoadingPage/>;
    }

    return (
        <div className="flex flex-col items-center">
            {noAdvertPostedError ? (
                <div className="w-full p-5">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        < AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {noAdvertPostedError}
                        </AlertDescription>
                    </Alert>
                </div>
            ) : (
                advert && (
                    <div className="justify-center text-center">
                        <h1 className="text-xl md:text-2xl lg:text-3xl mt-10 font-bold">
                            {advert.title}
                        </h1>

                        <p className="mt-5">
                            {advert.userFirstName} {advert.userLastName} | {transformDateAdvertCreated(advert.dateCreated)}
                        </p>

                        <p className="text-base/7 text-justify p-5">
                            {advert.description}
                        </p>

                        <div className="p-5">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Prices starting from:</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-row gap-4 items-center justify-center">
                                        <HandCoins size={100} strokeWidth={1}/>
                                        <p className="text-2xl ">{advert.price} <b>PLN</b></p>
                                    </div>
                                    <p className="mt-5">
                                        This is a price for per one <b>{advert.categoryName}</b> inquiry!
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-center align-middle">
                            <iframe
                                src={transformPlaylistUrlToEmbedUrl(advert.portfolioUrl)}
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

                        {
                            (isAuthenticated && userData.roleName === AppRoles.Client || userData.roleName === AppRoles.Admin)
                            &&
                            <Button className="mt-15" onClick={() => navigate(`/chat/${advert?.idUser}`)}>Message
                                me!</Button>
                        }

                        <h1 className="text-xl md:text-2xl lg:text-3xl mt-10 mb-5 font-bold">
                            See my reviews!
                        </h1>

                        {/* Displaying all reviews */}
                        {
                            (reviews?.items && reviews.items.length > 0) ?
                                reviews.items.map((review: Review) => (
                                    <div key={review.idReview} className="p-5 flex justify-center">
                                        <Card className="w-xs md:w-full">
                                            <CardHeader>
                                                <div className="flex justify-between">
                                                    <span>
                                                        {review.clientFirstName} {review.clientLastName}
                                                    </span>
                                                    <span>
                                                        <Rating value={review.satisfactionLevel}
                                                                changeable={false}
                                                                onChange={() => {
                                                                    return;
                                                                }}/>
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm text-muted-foreground">
                                                    <span>
                                                        {AppRoles.Client}
                                                    </span>
                                                    <span>
                                                        {
                                                            formatDistanceToNow(new Date(`${review.dateCreated}`), {
                                                                addSuffix: true,
                                                            })
                                                        }
                                                    </span>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-base text-justify wrap-break-word">
                                                    {review.content}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )) : (
                                    <div className="m-10">
                                        <p>This advert has no reviews.</p>
                                    </div>
                                )
                        }

                        {/* Form for adding a review */}
                        {
                            userData.roleName == AppRoles.Client &&
                            (<div className="flex justify-center p-10">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleAddReview)} className="w-xs md:w-full">
                                        <FormLabel className="mb-3">
                                            Share your own experience with this engineer!
                                        </FormLabel>

                                        <FormField
                                            control={form.control}
                                            name="satisfactionLevel"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Rating
                                                            {...field}
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
                    </div>
                )
            )}
            {error &&
                <div className="w-full p-5 -mt-10">
                    <Alert variant="destructive">

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

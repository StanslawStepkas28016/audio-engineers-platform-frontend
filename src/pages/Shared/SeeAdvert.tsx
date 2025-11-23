import {axiosInstance} from "@/lib/axios.ts";
import {useState} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Facebook, HandCoins, Instagram, Linkedin} from "lucide-react";
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
import {useQuery} from "@tanstack/react-query";
import {Advert, Review, ReviewsPaginated} from "@/types/types.ts";

export const SeeAdvert = () => {
    const {idAdvert} = useParams<{ idAdvert: string }>();
    const {userData, isAuthenticated} = useUserStore();
    const navigate = useNavigate();

    const [inputError, setInputError] = useState("");
    const [error, setError] = useState("");

    const {data: advert, isLoading: isLoadingAdvert} = useQuery(
            {
                queryFn: async () => await axiosInstance
                        .get(`/advert/${idAdvert}/details`)
                        .then(r => r.data as Advert)
                        .catch(e => {
                            setError(e.response.data.ExceptionMessage || "Error loading adverts.");
                            return undefined;
                        }),
                queryKey: ['fetchUserAdvert', {idAdvert}]
            }
    );

    const {data: reviews, isLoading: isLoadingReviews, refetch: refetchReviews} = useQuery(
            {
                queryFn: async () => await axiosInstance
                        .get(`/advert/${idAdvert}/reviews`, {
                            params: {
                                page: 1,
                                pageSize: 20
                            }
                        })
                        .then(r => r.data as ReviewsPaginated)
                        .catch(e => setError(e.response.data.ExceptionMessage || "Error loading reviews.")),
                queryKey: ['fetchAdvertReviews', {idAdvert}]
            }
    );

    const addReviewFormValidationSchema = z.object({
        idUserReviewer: z
                .string(),
        content: z
                .string()
                .min(35, {message: "Content must be at least 35 characters"})
                .max(1500, {message: "Content must be less than 1500 characters"}),
        satisfactionLevel: z
                .number()
                .min(1, {message: "SatisfactionLevel must be at least 1"})
                .max(5, {message: "SatisfactionLevel must be at most 5"}),
    });

    const addReviewForm = useForm<z.infer<typeof addReviewFormValidationSchema>>({
        resolver: zodResolver(addReviewFormValidationSchema),
        defaultValues: {
            idUserReviewer: userData.idUser,
            content: "",
            satisfactionLevel: 3,
        },
    });

    const handleSubmit = async () => {
        setInputError("");

        await axiosInstance.post(`/advert/${idAdvert}/review`, addReviewForm.getValues())
                .then(async () => {
                            addReviewForm.reset();
                            await refetchReviews();
                        }
                )
                .catch(e => setInputError(e.response.data.ExceptionMessage || "Error adding review"));
    }

    if (isLoadingAdvert || isLoadingReviews) {
        return <LoadingPage/>;
    }

    return (
            <>
                {error ? (
                        <div className="w-full p-5">
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4"/>
                                < AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        </div>
                ):(
                        advert && (
                                <div className="flex flex-col items-center">
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
                                                    <CardTitle className="text-xl font-bold">Prices starting
                                                        from:</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex flex-row gap-4 items-center justify-center">
                                                        <HandCoins size={100} strokeWidth={1}/>
                                                        <p className="text-2xl ">{advert.price} <b>PLN</b></p>
                                                    </div>
                                                    <p className="mt-5">
                                                        This is a price for per
                                                        one <b>{advert.categoryName}</b> inquiry!
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        <div className="flex justify-center align-middle">
                                            <iframe
                                                    src={transformPlaylistUrlToEmbedUrl(advert.portfolioUrl)}
                                                    className="w-full p-5 mb-[-180px] sm:mb-0"
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
                                                (isAuthenticated && userData.roleName===AppRoles.Client || userData.roleName===AppRoles.Administrator)
                                                &&
                                            <Button className="mt-15"
                                                    onClick={() => navigate(`/chat/${advert?.idUser}`)}>Message
                                                me!</Button>
                                        }

                                        <h1 className="text-xl md:text-2xl lg:text-3xl mt-10 mb-5 font-bold">
                                            See my reviews!
                                        </h1>

                                        {/* Displaying all reviews */}
                                        {
                                            (reviews?.items && reviews.items.length > 0) ?
                                                    reviews.items.map((review: Review) => (
                                                            <div key={review.idReview}
                                                                 className="p-5 flex justify-center">
                                                                <Card className="w-full">
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
                                                    )):(
                                                            <div className="m-10">
                                                                <p>This advert has no reviews.</p>
                                                            </div>
                                                    )
                                        }

                                        {/* Form for adding a review */}
                                        {
                                                userData.roleName==AppRoles.Client &&
                                                (<div className="flex justify-center p-10">
                                                    <Form {...addReviewForm}>
                                                        <form onSubmit={addReviewForm.handleSubmit(handleSubmit)}
                                                              className="w-xs md:w-full">
                                                            <FormLabel className="mb-3">
                                                                Share your own experience with this engineer!
                                                            </FormLabel>

                                                            <FormField
                                                                    control={addReviewForm.control}
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
                                                                    control={addReviewForm.control}
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
                                </div>

                        )
                )}
                {inputError &&
                    <div className="w-full p-5 -mt-10">
                        <Alert variant="destructive">

                            <AlertCircle className="h-4 w-4"/>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {inputError}
                            </AlertDescription>
                        </Alert>
                    </div>
                }
            </>
    );
}

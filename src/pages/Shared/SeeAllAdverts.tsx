import {useState} from "react";
import {AlertCircle, SearchIcon, WalletIcon} from "lucide-react";
import {axiosInstance} from "@/lib/axios.ts";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {transformDateAdvertCreated} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination.tsx"
import {Input} from "@/components/ui/input.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {Form, FormField, FormItem} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {AdvertOverviewsPaginated, AdvertOverview} from "@/types/types.ts";


export const SeeAllAdverts = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPageSearchParam = searchParams.get("page") ? Number(searchParams.get("page")!) : 1;
    const currentSearchTermSearchParam = searchParams.get("searchTerm") ? searchParams.get("searchTerm") : "";
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const {data: advertsData, isLoading: isLoadingAdverts} = useQuery({
        queryFn: async () => await axiosInstance
            .get("advert/summaries", {
                params: {
                    sortOrder: "price_desc",
                    page: currentPageSearchParam,
                    pageSize: 3,
                    searchTerm: currentSearchTermSearchParam
                },
            }).then(r => {
                if (r.data.items.length === 0) {
                    setError("No adverts found for the given search term.");
                }
                return r.data as AdvertOverviewsPaginated;
            })
            .catch(e => {
                setError(e.response.data.ExceptionMessage || "Error loading adverts.");
                return undefined;
            }),
        queryKey: ['fetchAdverts', {
            currentPage: currentPageSearchParam,
            currentSearchTerm: currentSearchTermSearchParam
        }],
    });

    const calculateTotalPages = () => {
        return advertsData ? Math.ceil(advertsData?.totalCount / advertsData?.pageSize) : 0;
    }

    const searchFormValidationSchema = z.object({
        searchTerm: z.string()
    });

    const searchForm = useForm<z.infer<typeof searchFormValidationSchema>>({
        resolver: zodResolver(searchFormValidationSchema),
        defaultValues: {
            searchTerm: "",
        }
    });

    const handleSubmit = async () => {
        setError("");
        setSearchParams({searchTerm: searchForm.getValues().searchTerm, page: "1"});
    }

    if (isLoadingAdverts) {
        return <LoadingPage/>;
    }

    return (
        <div className="container mx-auto flex flex-col items-center justify-center p-10">
            <h1 className="text-3xl font-bold text-center">
                Find the best audio engineers!
            </h1>

            <Form {...searchForm}>
                <form className="relative flex items-center mt-10" onSubmit={searchForm.handleSubmit(handleSubmit)}>
                    <SearchIcon
                        className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform"
                    />

                    <FormField
                        control={searchForm.control}
                        name="searchTerm"
                        render={({field}) => (
                            <FormItem>
                                <Input
                                    placeholder="Best mixes..."
                                    type="text"
                                    className="pl-8 w-3xs md:w-xl"
                                    {...field} />
                            </FormItem>
                        )}
                    />
                    <Button className="ml-2" type="submit">
                        Search
                    </Button>
                </form>
            </Form>

            {error && (<Alert variant="destructive" className="mt-10 mb-10 w-2/3">
                <AlertCircle className="h-4 w-4"/>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>)}

            <div className="mt-10">
                {advertsData?.items?.map((advert: AdvertOverview) => (
                    <div key={advert.title}>
                        <Card className="w-full max-w-3xl mb-8">
                            <CardHeader>
                                <CardTitle className="text-4xl">{advert.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3 md:grid-cols-2">
                                <div>
                                    <p
                                        className="text-4l text-muted-foreground">{advert.userFirstName} {advert.userLastName} | {transformDateAdvertCreated(advert.dateCreated)}
                                    </p>

                                    <Card className="p-10 mt-5">
                                        <div className="flex justify-between">
                                            <h1>
                                                Prices from:
                                                <p className="text-5xl">{advert.price} PLN</p>
                                            </h1>
                                            <WalletIcon absoluteStrokeWidth={true} size={75}
                                                        className="m-1"></WalletIcon>
                                        </div>
                                    </Card>

                                </div>

                                <div className="w-full h-64 md:h-80 overflow-hidden rounded-.lg">
                                    <img src={advert.coverImageUrl}
                                         className="w-full h-full object-cover rounded-xl"
                                         alt="img"/>
                                </div>
                            </CardContent>
                            <div className="flex align-middle justify-center">
                                <Button
                                    className="w-2xs md:w-2xl"
                                    onClick={() => {
                                        navigate(`/see-advert/${advert.idAdvert}`);
                                    }}
                                >
                                    See more
                                </Button>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => {
                                if (advertsData?.hasPreviousPage) {
                                    setSearchParams({
                                        searchTerm: searchForm.getValues().searchTerm,
                                        page: (currentPageSearchParam - 1).toString()
                                    });
                                }
                            }}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        {
                            Array.from({length: calculateTotalPages()}).map(
                                (_, index) => (
                                    <PaginationLink
                                        key={index}
                                        onClick={
                                            () => setSearchParams(
                                                {
                                                    searchTerm: searchForm.getValues().searchTerm,
                                                    page: (index + 1).toString()
                                                }
                                            )
                                        }
                                        isActive={currentPageSearchParam == index + 1}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                ))
                        }
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => {
                                if (advertsData?.hasNextPage) {
                                    setSearchParams(
                                        {
                                            searchTerm: searchForm.getValues().searchTerm,
                                            page: (currentPageSearchParam + 1).toString()
                                        }
                                    );
                                }
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
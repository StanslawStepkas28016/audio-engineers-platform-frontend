import {FormEvent, useState} from "react";
import {AlertCircle, SearchIcon, WalletIcon} from "lucide-react";
import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";
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
import {useQuery} from "react-query";
import {useErrorBoundary} from "react-error-boundary";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";

export type SingleAdvertOverviewData = {
    idAdvert: string,
    title: string,
    idUser: string,
    userFirstName: string,
    userLastName: string,
    dateCreated: Date,
    price: string,
    categoryName: string,
    coverImageKey: string,
    coverImageUrl: string,
    description: string,
}

export type AdvertsData = {
    items: SingleAdvertOverviewData[];
    page: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export const SeeAllAdverts = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const currentPage = searchParams.get("page") ? Number(searchParams.get("page")!) : 1;
    const currentSearchTerm = searchParams.get("searchTerm") ? searchParams.get("searchTerm") : "";
    const [currentInputSearchTerm, setCurrentInputSearchTerm] = useState("");

    const [searchError, setLocalError] = useState("");

    const {showBoundary} = useErrorBoundary();

    const fetchAdverts = async () => {
        setLocalError("");

        try {
            const response = await axiosInstance.get("advert/summaries", {
                params: {sortOrder: "price_desc", page: currentPage, pageSize: 3, searchTerm: currentSearchTerm},
            });

            if (response.data.items.length === 0) {
                setLocalError("No adverts found for the given search term.");
            }

            return response.data as AdvertsData;
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                setLocalError(e.response.data.ExceptionMessage);
            } else {
                // @ts-ignore
                showBoundary(e.response);
            }
        }
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        setLocalError("");

        const term = currentInputSearchTerm.trim();

        if (!term) {
            setLocalError("Please enter a valid search query!");
            return;
        }

        setSearchParams({searchTerm: term, page: "1"});
    }

    const calculateTotalPages = () => {
        return advertsData ? Math.ceil(advertsData?.totalCount / advertsData?.pageSize) : 0;
    }

    const {data: advertsData, isLoading} = useQuery({
        queryFn: fetchAdverts,
        queryKey: ['fetchAdverts', {currentPage, currentSearchTerm}],
    });

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (
        <div className="container mx-auto flex flex-col items-center justify-center p-10">
            <h1 className="text-3xl font-bold text-center">
                Find the best audio engineers!
            </h1>

            <form className="relative flex items-center mt-10" onSubmit={handleSearch}>
                <SearchIcon
                    className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform"
                />
                <Input
                    type="text"
                    placeholder="Search for specifing engineer"
                    className="pl-8 w-3xs md:w-xl"
                    defaultValue={currentSearchTerm || ""}
                    onChange={e => setCurrentInputSearchTerm(e.target.value)}
                />
                <Button
                    className="ml-2"
                >
                    Search
                </Button>
            </form>

            {searchError && (<Alert variant="destructive" className="mt-10 mb-10 w-2/3">
                <AlertCircle className="h-4 w-4"/>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {searchError}
                </AlertDescription>
            </Alert>)}

            <div className="mt-10">
                {advertsData?.items?.map((advert: SingleAdvertOverviewData) => (
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
                                        searchTerm: currentInputSearchTerm || "",
                                        page: (currentPage - 1).toString()
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
                                                    searchTerm: currentInputSearchTerm || "",
                                                    page: (index + 1).toString()
                                                }
                                            )
                                        }
                                        isActive={currentPage == index + 1}
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
                                            searchTerm: currentInputSearchTerm ? currentInputSearchTerm : "",
                                            page: (currentPage + 1).toString()
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
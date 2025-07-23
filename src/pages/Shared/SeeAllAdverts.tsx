import {FormEvent, useEffect, useState} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, SearchIcon, WalletIcon} from "lucide-react";
import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";
import {LoadingPage} from "@/pages/Shared/LoadingPage.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {transformDate} from "@/hooks/utils.ts";
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

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [advertData, setAdvertData] = useState<AdvertsData | null>(null);

    const currentPage = searchParams.get("page") ? Number(searchParams.get("page")!) : 1;
    const currentSearchTerm = searchParams.get("searchTerm") ? searchParams.get("searchTerm") : "";

    const [currentInputSearchTerm, setCurrentInputSearchTerm] = useState("");

    const fetchAdverts = async () => {
        setError("");
        setLoading(true);
        try {
            const response = await axiosInstance.get("advert/get-all", {
                params: {sortOrder: "price_desc", page: currentPage, pageSize: 3, searchTerm: currentSearchTerm},
            });

            setAdvertData(response.data);

            if (response.data.items.length === 0) {
                setError("No adverts found for the given search term.");
            }
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

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();

        const term = currentInputSearchTerm.trim();

        if (!term) {
            setError("Please enter a valid search query!");
            return;
        }

        setError("");
        setSearchParams({searchTerm: term, page: "1"});
    }

    const calculateTotalPages = () => {
        return advertData ? Math.ceil(advertData?.totalCount / advertData?.pageSize) : 0;
    }

    useEffect(() => {
        fetchAdverts();
        window.scrollTo(0, 0);
    }, [currentPage, currentSearchTerm])

    if (loading) {
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
                    onChange={e => setCurrentInputSearchTerm(e.target.value)}
                />
                <Button
                    className="ml-2"
                >
                    Search
                </Button>
            </form>

            {error && (<Alert variant="destructive" className="mt-10 mb-10 w-2/3">
                <AlertCircle className="h-4 w-4"/>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>)}

            <div className="mt-10">
                {advertData?.items?.map((advert: SingleAdvertOverviewData) => (
                    <div key={advert.title}>
                        <Card className="w-full max-w-3xl mb-8">
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
                                            <WalletIcon absoluteStrokeWidth={true} size={75}
                                                        className="m-1"></WalletIcon>
                                        </div>
                                    </Card>

                                </div>

                                <div className="w-full h-64 md:h-80 overflow-hidden rounded-.lg">
                                    <img src={advert.coverImageUrl} className="w-full h-full object-cover rounded-xl"
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
                                if (advertData?.hasPreviousPage) {
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
                                if (advertData?.hasNextPage) {
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
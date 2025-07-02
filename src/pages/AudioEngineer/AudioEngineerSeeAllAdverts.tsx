import {useEffect, useState} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, SearchIcon, WalletIcon} from "lucide-react";
import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";
import {LoadingPage} from "@/pages/Shared/LoadingPage.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {transformDate} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {Input} from "@/components/ui/input.tsx";

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

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchAdverts = async () => {
        setError("");
        setLoading(true);
        try {
            const response = await axiosInstance.get("advert/get-all", {
                params: {sortOrder: "price_desc", page: currentPage, pageSize: 2},
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

    const calculateTotalPages = () => {
        return advertData ? Math.ceil(advertData?.totalCount / advertData?.pageSize) : 0;
    }

    useEffect(() => {
        fetchAdverts()
    }, [currentPage])

    if (loading) {
        return <LoadingPage/>;
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mt-5">Find the best audio engineers!</h1>

            <div className="relative flex items-center w-1/2 mt-10">
                <SearchIcon
                    className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform"
                />
                <Input
                    type="text"
                    placeholder="Search for specifing engineer"
                    className=" pl-8"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                    className="ml-2"
                    disabled={loading || !searchQuery}
                    onClick={() => {
                        console.log(searchQuery)
                    }}
                >
                    Search
                </Button>
            </div>

            {advertData?.items?.map((advert: SingleAdvertOverviewData) => (
                <div key={advert.title}>
                    <Card className="w-full max-w-md my-10">
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

                            <div className="w-full h-64 md:h-80 overflow-hidden rounded-lg">
                                <img src={advert.coverImageUrl} className="w-full h-full object-cover" alt="img"/>
                            </div>
                        </CardContent>
                        <Button className="">See more</Button>
                    </Card>
                </div>
            ))}

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => {
                                if (advertData?.hasPreviousPage) {
                                    setCurrentPage(currentPage - 1);
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
                                        onClick={() => setCurrentPage(index + 1)}
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
                                    setCurrentPage(currentPage + 1);
                                }
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

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
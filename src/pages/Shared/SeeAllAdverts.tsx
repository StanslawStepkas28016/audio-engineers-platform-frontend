import {useState} from "react";
import {AlertCircle, SearchIcon, WalletIcon} from "lucide-react";
import {axiosInstance} from "@/lib/axios.ts";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
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
import {AdvertSummariesPaginated, AdvertSummary} from "@/types/types.ts";
import {useTranslation} from "react-i18next";
import {AdvertCategories} from "@/enums/advert-categories.tsx";
import {useIsMobile} from "@/hooks/use-mobile.ts";
import {format} from "date-fns";
import {AvailableLanguages} from "@/lib/i18n/i18n.ts";
import {enUS, pl} from "date-fns/locale";

const defaultPageSize = 3;
const defaultShortDescriptionLength = 150;

export const SeeAllAdverts = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const {t} = useTranslation();
    const isMobile = useIsMobile();

    const {data: advertsData, isLoading: isLoadingAdverts} = useQuery({
        queryFn: async () => await axiosInstance
                .get("advert/summaries", {
                    params: {
                        categoryFilterTerm: searchParams.get("categoryFilterTerm") || "",
                        searchTerm: searchParams.get("searchTerm") || "",
                        page: Number(searchParams.get("page") || 1),
                        pageSize: defaultPageSize
                    },
                }).then(r => {
                    if (r.data.items.length===0) {
                        setError(t("Shared.SeeAllAdverts.error-no-adverts-for-term"));
                    }
                    return r.data as AdvertSummariesPaginated;
                })
                .catch(() => {
                    const key = "Shared.SeeAllAdverts.error-no-adverts";
                    setError(t(key));
                }),
        queryKey: ['fetchAdverts', {
            currentCategoryFilterTerm: searchParams.get("categoryFilterTerm") || "",
            currentSearchTerm: searchParams.get("searchTerm") || "",
            currentPage: Number(searchParams.get("page") || 1),
        }],
    });

    const calculateTotalPages = () => {
        return advertsData ? Math.ceil(advertsData?.totalCount / advertsData?.pageSize):0;
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
            <>
                <div className="container mx-auto flex flex-col items-center justify-center p-10">
                    <h1 className="text-3xl font-bold text-center">
                        {t("Shared.SeeAllAdverts.slogan")}
                    </h1>

                    <Form {...searchForm}>
                        <form className="relative flex items-center mt-10"
                              onSubmit={searchForm.handleSubmit(handleSubmit)}>
                            <SearchIcon
                                    className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform"
                            />

                            <FormField
                                    control={searchForm.control}
                                    name="searchTerm"
                                    render={({field}) => (
                                            <FormItem>
                                                <Input
                                                        placeholder={t("Shared.SeeAllAdverts.searchPlaceholder")}
                                                        type="text"
                                                        className="pl-8 w-3xs md:w-xl"
                                                        {...field} />
                                            </FormItem>
                                    )}
                            />
                            <Button className="ml-2" type="submit">
                                {t("Shared.SeeAllAdverts.search")}
                            </Button>
                        </form>
                    </Form>
                </div>

                <div className="flex justify-center">
                    <div className="grid gap-4 w-3/4 sm:grid-cols-1 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("Shared.SeeAllAdverts.category-mixing")}</CardTitle>
                                <CardDescription>
                                    {t("Shared.SeeAllAdverts.category-mixing-description")}
                                </CardDescription>
                            </CardHeader>
                            <CardAction className="flex justify-center ml-2">
                                <Button
                                        variant="link"
                                        onClick={() => {
                                            setSearchParams({categoryFilterTerm: AdvertCategories.Mixing, page: "1"})
                                        }}
                                >
                                    {t("Shared.SeeAllAdverts.see-category")}
                                </Button>
                            </CardAction>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t("Shared.SeeAllAdverts.category-mastering")}</CardTitle>
                                <CardDescription>
                                    {t("Shared.SeeAllAdverts.category-mastering-description")}
                                </CardDescription>
                            </CardHeader>
                            <CardAction className="flex justify-center ml-2">
                                <Button variant="link" onClick={() => setSearchParams({
                                    categoryFilterTerm: AdvertCategories.Mastering,
                                    page: "1"
                                })}>{t("Shared.SeeAllAdverts.see-category")}</Button>
                            </CardAction>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t("Shared.SeeAllAdverts.category-production")}</CardTitle>
                                <CardDescription>
                                    {t("Shared.SeeAllAdverts.category-production-description")}
                                </CardDescription>
                            </CardHeader>
                            <CardAction className="flex justify-center ml-2" onClick={() => setSearchParams({
                                categoryFilterTerm: AdvertCategories.Production,
                                page: "1"
                            })}>
                                <Button variant="link">{t("Shared.SeeAllAdverts.see-category")}</Button>
                            </CardAction>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t("Shared.SeeAllAdverts.category-all")}</CardTitle>
                                <CardDescription>
                                    {t("Shared.SeeAllAdverts.category-all-description")}
                                </CardDescription>
                            </CardHeader>
                            <CardAction className="flex justify-center ml-2"
                                        onClick={() => setSearchParams({categoryFilterTerm: "", page: "1"})}>
                                <Button variant="link">{t("Shared.SeeAllAdverts.see-category")}</Button>
                            </CardAction>
                        </Card>
                    </div>
                </div>


                <div className="flex flex-col justify-center items-center">
                    {error && (
                            <>
                                <Alert variant="destructive" className="mt-10 w-2/3">
                                    <AlertCircle className="h-4 w-4"/>
                                    <AlertTitle>{t("Common.error")}</AlertTitle>
                                    <AlertDescription>
                                        {error}
                                    </AlertDescription>
                                </Alert>

                                <Button
                                        className="md: w-2/3 mt-5"
                                        onClick={() => {
                                            setSearchParams({searchTerm: "", page: "1"});
                                            setError("");
                                            searchForm.reset();
                                        }}
                                >
                                    {t("Shared.SeeAllAdverts.go-back")}
                                </Button>
                            </>
                    )}
                </div>

                <div className="container mx-auto flex flex-col items-center justify-center p-10">
                    <div>
                        {advertsData?.items?.map((advert: AdvertSummary) => (
                                <div key={advert.title}>
                                    <Card className="w-full max-w-3xl mb-8">
                                        <CardHeader>
                                            <CardTitle className="text-4xl">{advert.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid gap-3 md:grid-cols-2">
                                            <div>
                                                <p
                                                        className="text-4l text-muted-foreground">{advert.userFirstName} {advert.userLastName} | {format(new Date(advert.dateCreated), 'PPp', {locale: localStorage.getItem("lang")===AvailableLanguages.en ? enUS:pl})}
                                                </p>

                                                <Card className="p-10 mt-5">
                                                    <div className="flex justify-between">
                                                        <h1>
                                                            {t("Shared.SeeAllAdverts.prices-from")}
                                                            <p className="text-5xl">{advert.price} PLN</p>
                                                        </h1>
                                                        <WalletIcon absoluteStrokeWidth={true} size={isMobile ? 110:75}
                                                                    className="mt-2 p-1"></WalletIcon>
                                                    </div>
                                                </Card>

                                                <p className="text-muted-foreground mt-5">
                                                    {advert.descriptionShort.substring(0, defaultShortDescriptionLength)}...
                                                </p>

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
                                                        navigate(`see-advert/${advert.idAdvert}`);
                                                    }}
                                            >
                                                {t("Shared.SeeAllAdverts.see-more")}
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
                                                    page: (Number(searchParams.get("page") || 1) - 1).toString()
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
                                                            isActive={Number(searchParams.get("page") || 1)==index + 1}
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
                                                            page: (Number(searchParams.get("page") || 1) + 1).toString()
                                                        }
                                                );
                                            }
                                        }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>

            </>
    );
}
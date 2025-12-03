import {DataTable} from "@/components/ui/data-table.tsx";
import {createColumnHelper} from "@tanstack/react-table";
import {AdvertSummariesPaginated, AdvertSummary} from "@/types/types.ts";
import {axiosInstance} from "@/lib/axios.ts";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {useUserStore} from "@/stores/useUserStore.ts";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, MoreHorizontal} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import {format} from "date-fns";
import {enUS, pl} from "date-fns/locale";
import {AvailableLanguages} from "@/lib/i18n/i18n.ts";
import i18n from "i18next";

const columnHelper = createColumnHelper<AdvertSummary>();

const columns = [
    columnHelper.accessor("categoryName", {
        header: () => i18n.t("Admin.AdvertData.advert-category"),
        cell: (info) => info.getValue()
    }),
    columnHelper.accessor("title", {
        header: () => i18n.t("Admin.AdvertData.advert-title"),
        cell: (info) => info.getValue()
    }),
    columnHelper.accessor("description", {
        header: () => i18n.t("Admin.AdvertData.advert-description"),
        cell: (info) => info.getValue().substring(0, 45) + "..."
    }),
    columnHelper.accessor("dateCreated", {
        header: () => i18n.t("Admin.AdvertData.advert-date-created"),
        cell: (info) => format(new Date(info.getValue()), 'PPp', {locale: localStorage.getItem("lang")===AvailableLanguages.en ? enUS:pl})
    }),
    /*    columnHelper.accessor("coverImageUrl", {
            header: () => "Url",
            cell: (info) => (
                <div className="max-w-md whitespace-normal break-words">
                    {info.getValue()}
                </div>
            ),
        }),*/
    columnHelper.display(
            {
                id: "actions",
                header: i18n.t("Admin.AdvertData.actions"),
                cell: ({row}) => {
                    const advertSummary = row.original;
                    // TODO: Remember about this.

                    return (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        {i18n.t("Admin.AdvertData.edit")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        {i18n.t("Admin.AdvertData.delete")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                    )
                },
            },
    )
];

export const AdvertData = () => {
    const {t} = useTranslation();

    const [error, setError] = useState("");
    const {userData} = useUserStore();

    // TODO: Add specific tables and modals for editing data.
    const {data: advertsData, isLoading: isLoadingAdverts} = useQuery({
        queryFn: async () => await axiosInstance
                .get("advert/summaries", {
                    params: {
                        sortOrder: "price_desc",
                        page: 1,
                        pageSize: 10,
                        searchTerm: ""
                    },
                }).then(r => {
                    return r.data as AdvertSummariesPaginated;
                })
                .catch(() => {
                    const key = "Admin.AdvertData.error-loading-advert-data";
                    setError(t(key));
                }),
        queryKey: ['fetchAdverts', userData.idUser],
    });

    if (isLoadingAdverts) {
        return <LoadingPage/>;
    }

    return (
            <div className="flex flex-col w-full min-w-0 p-10 gap-4">
                {error
                        ? (
                                <div className="w-full p-5">
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4"/>
                                        <AlertTitle>{t("Common.error")}</AlertTitle>
                                        <AlertDescription>
                                            {error}
                                        </AlertDescription>
                                    </Alert>
                                </div>
                        ):(
                                <>
                                    <div className="flex flex-col items-center text-center">
                                        <h1 className="text-3xl font-bold mb-5">
                                            {t("Admin.AdvertData.title")}
                                        </h1>
                                    </div>
                                    <div className="w-full min-w-0 overflow-x-auto rounded-md border">
                                        <DataTable<AdvertSummary, never> columns={columns}
                                                                         data={advertsData?.items ?? []}/>
                                    </div>
                                </>
                        )
                }
            </div>);
}
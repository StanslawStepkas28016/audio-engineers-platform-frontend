import {DataTable} from "@/components/ui/data-table.tsx";
import {createColumnHelper} from "@tanstack/react-table";
import {AdvertOverviewsPaginated, AdvertOverview} from "@/types/types.ts";
import {axiosInstance} from "@/lib/axios.ts";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {useUserStore} from "@/stores/useUserStore.ts";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, MoreHorizontal} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";

const columnHelper = createColumnHelper<AdvertOverview>();

const columns = [
    columnHelper.display({
        id: "action",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }),
    columnHelper.accessor("idAdvert", {
        header: () => "IdAdvert",
        cell: (info) => info.getValue()
    }),
    columnHelper.accessor("coverImageKey", {
        header: () => "ImageKey",
        cell: (info) => info.getValue()
    }),
    columnHelper.accessor("categoryName", {
        header: () => "Category",
        cell: (info) => info.getValue()
    }),
    columnHelper.accessor("dateCreated", {
        header: () => "DateCreated",
        cell: (info) => info.getValue()
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
            cell: ({row}) => {
                const singleAdvertData = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(singleAdvertData.coverImageKey)}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    )
];

export const AdminDashboard = () => {
    const [error, setError] = useState("");
    const {userData} = useUserStore();

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
                return r.data as AdvertOverviewsPaginated;
            })
            .catch(e => {
                setError(e.response.data.ExceptionMessage || "Error loading adverts.");
                return undefined;
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
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : (
                    <div className="w-full min-w-0 overflow-x-auto rounded-md border">
                        <DataTable<AdvertOverview, any> columns={columns} data={advertsData?.items ?? []}/>
                    </div>
                )
            }
        </div>);
}
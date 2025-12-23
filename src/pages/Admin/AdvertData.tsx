import {DataTable} from "@/components/ui/data-table-adverts.tsx";
import {createColumnHelper} from "@tanstack/react-table";
import {AdvertSummariesPaginated, AdvertSummary} from "@/types/types.ts";
import {axiosInstance} from "@/lib/axios.ts";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {useUserStore} from "@/stores/useUserStore.ts";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, ArrowUpDown, MoreHorizontal, Terminal} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import {format} from "date-fns";
import {enUS, pl} from "date-fns/locale";
import {AvailableLanguages} from "@/lib/i18n/i18n.ts";
import i18n from "i18next";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import {create} from "zustand/react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {AutosizeTextarea} from "@/components/ui/autosize-textarea.tsx";

type UseAdvertModalStore = {
    currentAdvertData: AdvertSummary,
    isEnabled: boolean,
    setData: (advertSummary: AdvertSummary) => Promise<void>,
    setIsEnabled: (isEnabled: boolean) => Promise<void>
}

const useAdvertModalStore = create<UseAdvertModalStore>()((set) => ({
    currentAdvertData: {} as AdvertSummary,
    isEnabled: false,

    setData: async (advertSummary) => {
        set({
            currentAdvertData: advertSummary
        })
    },

    setIsEnabled: async (isEnabled) => {
        set({
            isEnabled: isEnabled
        })
    }
}));

const columnHelper = createColumnHelper<AdvertSummary>();

const columns = [
    columnHelper.accessor("categoryName", {
        header: () => i18n.t("Admin.AdvertData.advert-category"),
        cell: (info) => info.getValue()
    }),
    columnHelper.accessor("price", {
        header: ({column}) => {
            return (
                    <>
                        <Button
                                variant="ghost"
                                className="-ml-3"
                                onClick={() => column.toggleSorting(column.getIsSorted()==="asc")}
                        >
                            {i18n.t("Admin.AdvertData.advert-price")}
                            <ArrowUpDown/>
                        </Button>
                    </>
            )
        },
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
        header: ({column}) => {
            return (
                    <>
                        <Button
                                variant="ghost"
                                className="-ml-3"
                                onClick={() => column.toggleSorting(column.getIsSorted()==="asc")}
                        >
                            {i18n.t("Admin.AdvertData.advert-date-created")}
                            <ArrowUpDown/>
                        </Button>
                    </>
            )
        },
        cell: (info) => format(new Date(info.getValue()), 'PPp', {locale: localStorage.getItem("lang")===AvailableLanguages.en ? enUS:pl})
    }),
    columnHelper.display(
            {
                id: "actions",
                header: i18n.t("Admin.AdvertData.actions"),
                cell: ({row}) => {
                    // Pass the advert data to the modal state.
                    const advertSummary = row.original;

                    return (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={async () => {
                                        await useAdvertModalStore.getState().setData(advertSummary);
                                        await useAdvertModalStore.getState().setIsEnabled(true);
                                    }}>
                                        {i18n.t("Admin.AdvertData.edit")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={async () => {
                                        await axiosInstance.delete(`/advert/${advertSummary.idAdvert}`, {
                                            data: {
                                                idUser: advertSummary.idUser
                                            }
                                        })
                                                .then(
                                                        () => {
                                                            setTimeout(() => window.location.reload(), 1000);
                                                        })
                                                .catch();
                                    }}>
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

    const {data: advertsData, isLoading: isLoadingAdverts} = useQuery({
        queryFn: async () => await axiosInstance
                .get("advert/summaries", {
                    params: {
                        sortOrder: "",
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

    const {isEnabled, setIsEnabled, currentAdvertData} = useAdvertModalStore();

    const editAdvertDataValidationSchema = z.object({
        title: z
                .string()
                .min(1, t("AudioEngineer.AddAdvert.error-title-min")),
        description: z
                .string()
                .min(100, t("AudioEngineer.AddAdvert.error-description-min"))
                .max(1500, t("AudioEngineer.AddAdvert.error-description-max")),
        price: z
                .string()
                .refine((val) => !isNaN(Number(val)) && Number(val) >= 10, {
                    message: t("AudioEngineer.AddAdvert.error-price-min")
                })
                .refine((val) => !isNaN(Number(val)) && Number(val) <= 1500, {
                    message: t("AudioEngineer.AddAdvert.error-price-max")
                })
    });

    const editAdvertDataForm = useForm<z.infer<typeof editAdvertDataValidationSchema>>({
        resolver: zodResolver(editAdvertDataValidationSchema),
        defaultValues: {
            title: currentAdvertData.title,
            description: currentAdvertData.description,
            price: currentAdvertData.price
        },
    });

    const [editAdvertError, setEditAdvertError] = useState("");
    const [editAdvertSuccess, setEditAdvertSuccess] = useState("");

    const handleEditAdvertDataFormSubmit = async () => {
        await axiosInstance
                .patch(`/advert/${currentAdvertData.idAdvert}`, {
                    idUser: currentAdvertData.idUser,
                    title: editAdvertDataForm.getValues().title,
                    description: editAdvertDataForm.getValues().description,
                    portfolioUrl: "",
                    price: editAdvertDataForm.getValues().price
                })
                .then(() => {
                    setEditAdvertSuccess(t("Admin.AdvertData.edit-advert-success-message"));
                    setTimeout(() => window.location.reload(), 1000);
                })
                .catch(() => {
                    const key = "Admin.AdvertData.error-fallback";
                    setEditAdvertError(t(key));
                });
    }

    useEffect(() => {
        editAdvertDataForm.reset({
            title: currentAdvertData.title,
            description: currentAdvertData.description,
            price: String(currentAdvertData.price)
        });
    }, [currentAdvertData, editAdvertDataForm]);

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

                                    <AlertDialog open={isEnabled} onOpenChange={setIsEnabled}>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>{t("Admin.AdvertData.edit-advert-title")}</AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <div>
                                                <Form {...editAdvertDataForm}>
                                                    <form onSubmit={editAdvertDataForm.handleSubmit(handleEditAdvertDataFormSubmit)}
                                                          className="w-full max-w-2xl mx-auto space-y-8 flex flex-col">
                                                        <FormField
                                                                control={editAdvertDataForm.control}
                                                                name="title"
                                                                render={({field}) => (
                                                                        <FormItem>
                                                                            <FormLabel>{t("AudioEngineer.AddAdvert.title-label")}</FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                        placeholder={t("AudioEngineer.AddAdvert.title-placeholder")}
                                                                                        type="text"
                                                                                        {...field} />
                                                                            </FormControl>
                                                                            <FormDescription>{t("Admin.AdvertData.edit-advert-title-description")}</FormDescription>
                                                                            <FormMessage/>
                                                                        </FormItem>
                                                                )}
                                                        />

                                                        <FormField
                                                                control={editAdvertDataForm.control}
                                                                name="description"
                                                                render={({field}) => (
                                                                        <FormItem>
                                                                            <FormLabel>{t("AudioEngineer.AddAdvert.description-label")}</FormLabel>
                                                                            <FormControl>
                                                                                <AutosizeTextarea
                                                                                        placeholder={t("AudioEngineer.AddAdvert.description-placeholder")}
                                                                                        {...field}
                                                                                />
                                                                            </FormControl>
                                                                            <FormDescription>{t("Admin.AdvertData.edit-advert-description-description")}</FormDescription>
                                                                            <FormMessage/>
                                                                        </FormItem>
                                                                )}
                                                        />

                                                        <FormField
                                                                control={editAdvertDataForm.control}
                                                                name="price"
                                                                render={({field}) => (
                                                                        <FormItem>
                                                                            <FormLabel>{t("AudioEngineer.AddAdvert.price-label")}</FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                        placeholder="e.g. 200"
                                                                                        type="text"
                                                                                        step="1"
                                                                                        {...field} />
                                                                            </FormControl>
                                                                            <FormDescription>{t("Admin.AdvertData.edit-advert-price-description")}</FormDescription>
                                                                            <FormMessage/>
                                                                        </FormItem>
                                                                )}
                                                        />

                                                        <Button type="submit">{t("Common.submit")}</Button>

                                                        {editAdvertError && (
                                                                <Alert variant="destructive">
                                                                    <AlertCircle className="h-4 w-4"/>
                                                                    <AlertTitle>{t("Common.error")}</AlertTitle>
                                                                    <AlertDescription>
                                                                        {editAdvertError}
                                                                    </AlertDescription>
                                                                </Alert>
                                                        )}

                                                        {editAdvertSuccess && (
                                                                <Alert className="mb-2">
                                                                    <Terminal className="h-4 w-4"/>
                                                                    <AlertTitle>{t("Common.success")}</AlertTitle>
                                                                    <AlertDescription>
                                                                        {editAdvertSuccess}
                                                                    </AlertDescription>
                                                                </Alert>
                                                        )}
                                                    </form>
                                                </Form>
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    {t("Common.close")}
                                                </AlertDialogCancel>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                </>
                        )
                }
            </div>);
}
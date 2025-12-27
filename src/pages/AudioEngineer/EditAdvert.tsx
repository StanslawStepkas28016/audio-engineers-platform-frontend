import {useState} from "react";
import {axiosInstance} from "@/lib/axios.ts";
import {useUserStore} from "@/stores/useUserStore.ts";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {AutosizeTextarea} from "@/components/ui/autosize-textarea.tsx";
import {AlertCircle, InfoIcon, Terminal} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";
import {Advert} from "@/types/types.ts";

export const EditAdvert = () => {
    const {t} = useTranslation();

    const {userData} = useUserStore();
    const navigate = useNavigate();
    const [success, setSuccess] = useState("");
    const [editingError, setEditingError] = useState("");
    const [error, setError] = useState("");

    const {data: idAdvert, isLoading: isLoadingIdAdvert} = useQuery(
            {
                queryFn: async () => await axiosInstance
                        .get(`/advert/${userData.idUser}/id-advert`)
                        .then(r => r.data.idAdvert)
                        .catch(() => setError(t("AudioEngineer.EditAdvert.error-no-advert-posted"))),
                queryKey: ['idAdvertByIdUserForEdit', userData.idUser]
            }
    );

    const {isLoading: isLoadingAdvertData} = useQuery(
            {
                queryFn:
                        async () => await axiosInstance
                                .get(`/advert/${idAdvert}/details`)
                                .then(response => {
                                    const advertData = response.data as Advert;

                                    editAdvertForm.reset({
                                        idUser: userData.idUser,
                                        title: advertData.title,
                                        description: advertData.description,
                                        portfolioUrl: advertData.portfolioUrl,
                                        price: String(advertData.price)
                                    });
                                })
                                .catch(() => setError(t("AudioEngineer.EditAdvert.error-loading"))),
                queryKey: ['advertDetails', idAdvert],
                enabled: !!idAdvert
            }
    );

    const editAdvertFormValidationSchema = z.object({
        idUser: z.string(),
        title: z
                .string()
                .min(1, t("AudioEngineer.EditAdvert.error-title-len-min")),
        description: z
                .string()
                .min(100, t("AudioEngineer.EditAdvert.error-description-len-min"))
                .max(1500, t("AudioEngineer.EditAdvert.error-description-len-max")),
        portfolioUrl: z
                .string()
                .min(20, t("AudioEngineer.EditAdvert.error-portfolio-min"))
                .url(t("AudioEngineer.EditAdvert.error-portfolio-url")),
        price: z
                .string()
                .refine((val) => !isNaN(Number(val)) && Number(val) >= 10, {
                    message: t("AudioEngineer.EditAdvert.error-price-min")
                })
                .refine((val) => !isNaN(Number(val)) && Number(val) <= 1500, {
                    message: t("AudioEngineer.EditAdvert.error-price-max")
                }),
    });

    const editAdvertForm = useForm<z.infer<typeof editAdvertFormValidationSchema>>({
        resolver: zodResolver(editAdvertFormValidationSchema),
        defaultValues: {
            idUser: "",
            title: "",
            description: "",
            portfolioUrl: "",
            price: ""
        }
    });

    const handleSubmit = async () => {
        setEditingError("");
        setSuccess("");

        if (!editAdvertForm.formState.isDirty) {
            setEditingError(t("AudioEngineer.EditAdvert.error-non-dirty"));
            return;
        }

        await axiosInstance
                .patch(`/advert/${idAdvert}`, editAdvertForm.getValues())
                .then(
                        () => {
                            setSuccess(t("AudioEngineer.EditAdvert.success"));
                            setTimeout(() => navigate("/"), 1000);
                        })
                .catch(
                        () => {
                            const key = "AudioEngineer.EditAdvert.error-fallback";
                            setError(t(key));
                        }
                );
    }

    if (isLoadingIdAdvert || isLoadingAdvertData) {
        return <LoadingPage/>;
    }

    return (
            <>
                {error ? (
                        <div className="flex flex-col justify-center items-center w-full p-5">
                            <Alert variant="default">
                                <InfoIcon className="h-4 w-4"/>
                                <AlertTitle>{t("Common.info")}</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        </div>
                ):(
                        <div className="p-10 md: flex flex-col h-full justify-center">
                            <h1 className="text-3xl font-bold mb-10 text-center">
                                {t("AudioEngineer.EditAdvert.title")}
                            </h1>

                            <Form {...editAdvertForm}>
                                <form onSubmit={editAdvertForm.handleSubmit(handleSubmit)}
                                      className="w-full max-w-2xl mx-auto space-y-8 flex flex-col">
                                    <FormField
                                            control={editAdvertForm.control}
                                            name="title"
                                            render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>{t("AudioEngineer.EditAdvert.current-title-label")}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                    type="text"
                                                                    {...field} />
                                                        </FormControl>
                                                        <FormDescription>{t("AudioEngineer.EditAdvert.current-title-description")}</FormDescription>
                                                        <FormMessage/>
                                                    </FormItem>
                                            )}
                                    />

                                    <FormField
                                            control={editAdvertForm.control}
                                            name="description"
                                            render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>{t("AudioEngineer.EditAdvert.current-description-label")}</FormLabel>
                                                        <FormControl>
                                                            <AutosizeTextarea
                                                                    {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>{t("AudioEngineer.EditAdvert.current-description-description")}</FormDescription>
                                                        <FormMessage/>
                                                    </FormItem>
                                            )}
                                    />

                                    <FormField
                                            control={editAdvertForm.control}
                                            name="portfolioUrl"
                                            render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>{t("AudioEngineer.EditAdvert.current-portfolio-url-label")}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                    placeholder="e.g. https://open.spotify.com/playlist/1LBgAu0kv1q7CVzLFRjaUs?si=87c71b8d80d644bc"

                                                                    type="text"
                                                                    {...field} />
                                                        </FormControl>
                                                        <FormDescription>{t("AudioEngineer.EditAdvert.current-portfolio-url-description")}</FormDescription>
                                                        <FormMessage/>
                                                    </FormItem>
                                            )}
                                    />

                                    <FormField
                                            control={editAdvertForm.control}
                                            name="price"
                                            render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>{t("AudioEngineer.EditAdvert.current-price-label")}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                    placeholder="e.g. 200"
                                                                    type="number"
                                                                    step="1"
                                                                    {...field} />
                                                        </FormControl>
                                                        <FormDescription>{t("AudioEngineer.EditAdvert.current-price-description")}</FormDescription>
                                                        <FormMessage/>
                                                    </FormItem>
                                            )}
                                    />

                                    <Button type="submit">{t("Common.submit")}</Button>

                                    {editingError && (
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4"/>
                                                <AlertTitle>{t("Common.error")}</AlertTitle>
                                                <AlertDescription>
                                                    {editingError}
                                                </AlertDescription>
                                            </Alert>
                                    )}
                                    {success && (
                                            <Alert>
                                                <Terminal className="h-4 w-4"/>
                                                <AlertTitle>{t("Common.success")}</AlertTitle>
                                                <AlertDescription>
                                                    {success}
                                                </AlertDescription>
                                            </Alert>
                                    )}
                                </form>
                            </Form>
                        </div>
                )}
            </>
    );
}
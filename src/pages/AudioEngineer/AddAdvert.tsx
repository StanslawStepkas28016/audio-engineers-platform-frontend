"use client"
import {
    useState
} from "react"
import {
    Controller,
    useForm
} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"

import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {FileInput, FileUploader, FileUploaderContent, FileUploaderItem} from "@/components/ui/file-upload-custom.tsx";
import {AlertCircle, CloudUpload, InfoIcon, Paperclip, Terminal} from "lucide-react";
import {AdvertCategories} from "@/enums/advert-categories.tsx";
import {AutosizeTextarea} from "@/components/ui/autosize-textarea.tsx";
import {axiosInstance} from "@/lib/axios.ts";
import {useUserStore} from "@/stores/useUserStore.ts";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {useTranslation} from "react-i18next";

export const AddAdvert = () => {
    const {t} = useTranslation();

    const [error, setError] = useState("");
    const [advertAlreadyPostedInfo, setAdvertAlreadyPostedInfo] = useState("");
    const [success, setSuccess] = useState("");
    const {userData} = useUserStore();
    const navigate = useNavigate();

    const {isLoading: isLoadingIdAdvert} = useQuery(
            {
                queryFn: async () => await axiosInstance
                        .get(`advert/${userData.idUser}/id-advert`)
                        .then(r => {
                            if (r.data.idAdvert) {
                                setAdvertAlreadyPostedInfo(t("AudioEngineer.AddAdvert.error-advert-already-posted"))
                            }
                        })
                        .catch(() => {
                            // This catch is explicitly left empty, as the API
                            // throws an exception if the idAdvert is not found.
                            // In this functionality it is expected for the user not have an advert posted.
                            return undefined;
                        }),
                queryKey: ['getIdAdvertByIdUserForAdd', userData.idUser]
            }
    );

    const dropZoneConfig = {
        maxFiles: 1,
        maxSize: 1024 * 1024 * 4,
        multiple: true,
    };

    const addAdvertFormValidationSchema = z.object({
        idUser: z.string(),
        title: z
                .string()
                .min(1, t("AudioEngineer.AddAdvert.error-title-min")),
        description: z
                .string()
                .min(100, t("AudioEngineer.AddAdvert.error-description-min"))
                .max(1500, t("AudioEngineer.AddAdvert.error-description-max")),
        coverImageFile: z
                .instanceof(File, {message: t("AudioEngineer.AddAdvert.error-select-image")})
                .refine((file) =>
                                ["image/jpeg", "image/png", "image/gif"].includes(file.type),
                        {message: t("AudioEngineer.AddAdvert.error-only-image")}
                )
                .refine((file) => file.size <= 4 * 1024 * 1024, {
                    message: t("AudioEngineer.AddAdvert.error-image-size"),
                }),
        portfolioUrl: z
                .string()
                .min(20, t("AudioEngineer.AddAdvert.error-portfolio-min"))
                .url(t("AudioEngineer.AddAdvert.error-portfolio-url")),
        price: z
                .string()
                .refine((val) => !isNaN(Number(val)) && Number(val) >= 10, {
                    message: t("AudioEngineer.AddAdvert.error-price-min")
                })
                .refine((val) => !isNaN(Number(val)) && Number(val) <= 1500, {
                    message: t("AudioEngineer.AddAdvert.error-price-max")
                }),
        categoryName: z
                .string(),
    });

    const addAdvertForm = useForm<z.infer<typeof addAdvertFormValidationSchema>>({
        resolver: zodResolver(addAdvertFormValidationSchema),
        defaultValues: {
            idUser: userData.idUser,
            title: "",
            description: "",
            coverImageFile: undefined, // Initially no file selected.
            portfolioUrl: "",
            price: "0",
            categoryName: AdvertCategories.Mixing, // Default category.
        },
    });

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        await axiosInstance.post(
                "advert",
                addAdvertForm.getValues(),
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
        ).then(() => {
            setSuccess(t("AudioEngineer.AddAdvert.success"));
            setTimeout(() => navigate("/"), 1000);
        }).catch(() => {
            const key = "AudioEngineer.AddAdvert.error-fallback";
            setError(t(key));
        });
    }

    if (isLoadingIdAdvert) {
        return <LoadingPage/>;
    }

    return (
            <>
                {advertAlreadyPostedInfo ? (
                                <div className="w-full p-5">
                                    <Alert variant="default">
                                        <AlertCircle className="h-4 w-4"/>
                                        <AlertTitle>{t("Common.info")}</AlertTitle>
                                        <AlertDescription>
                                            {advertAlreadyPostedInfo}
                                        </AlertDescription>
                                    </Alert>
                                </div>
                        ):
                        (
                                <div className="p-10 md: flex flex-col h-full justify-center">
                                    <div className="flex flex-col p-10">
                                        <div className="text-center">
                                            <h1 className="text-3xl font-bold mb-10">
                                                {t("AudioEngineer.AddAdvert.title")}
                                            </h1>
                                        </div>
                                        <Form {...addAdvertForm}>
                                            <form onSubmit={addAdvertForm.handleSubmit(handleSubmit)}
                                                  className="w-full max-w-2xl mx-auto space-y-8 flex flex-col">
                                                <FormField
                                                        control={addAdvertForm.control}
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
                                                                    <FormDescription>{t("AudioEngineer.AddAdvert.title-description")}</FormDescription>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                        )}
                                                />

                                                <FormField
                                                        control={addAdvertForm.control}
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
                                                                    <FormDescription>{t("AudioEngineer.AddAdvert.description-description")}</FormDescription>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                        )}
                                                />

                                                <FormField
                                                        control={addAdvertForm.control}
                                                        name="coverImageFile"
                                                        render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>{t("AudioEngineer.AddAdvert.cover-image-label")}</FormLabel>
                                                                    <FormControl>
                                                                        <Controller
                                                                                control={addAdvertForm.control}
                                                                                name="coverImageFile"
                                                                                defaultValue={undefined}
                                                                                render={({
                                                                                             field: {
                                                                                                 value,
                                                                                                 onChange
                                                                                             }
                                                                                         }) => (
                                                                                        <FileUploader
                                                                                                value={value ? [value]:[]}
                                                                                                onValueChange={(files) => {
                                                                                                    onChange(files && files[0] ? files[0]:null);
                                                                                                }}
                                                                                                dropzoneOptions={dropZoneConfig}
                                                                                                className="relative bg-background rounded-lg p-2"
                                                                                        >
                                                                                            <FileInput
                                                                                                    id="fileInput"
                                                                                                    className="outline-dashed outline-1"
                                                                                                    {...field}
                                                                                            >
                                                                                                <div
                                                                                                        className="flex items-center justify-center flex-col p-8 w-full ">
                                                                                                    <CloudUpload/>
                                                                                                    <p className="mb-1 text-sm">
                                                                                                        <span>{t("AudioEngineer.AddAdvert.click-to")}</span>
                                                                                                    </p>
                                                                                                    <p className="text-xs">
                                                                                                        {t("AudioEngineer.AddAdvert.png-or")}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </FileInput>
                                                                                            <FileUploaderContent>
                                                                                                {value && (
                                                                                                        <FileUploaderItem
                                                                                                                index={0}>
                                                                                                            <Paperclip
                                                                                                                    className="h-4 w-4 stroke-current"/>
                                                                                                            <span>{value.name}</span>
                                                                                                        </FileUploaderItem>
                                                                                                )}
                                                                                            </FileUploaderContent>
                                                                                        </FileUploader>
                                                                                )}
                                                                        />
                                                                    </FormControl>
                                                                    <FormDescription>{t("AudioEngineer.AddAdvert.cover-image-description")}</FormDescription>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                        )}
                                                />
                                                <FormField
                                                        control={addAdvertForm.control}
                                                        name="portfolioUrl"
                                                        render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>{t("AudioEngineer.AddAdvert.portfolio-label")}</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                                placeholder={t("AudioEngineer.AddAdvert.portfolio-placeholder")}
                                                                                type="text"
                                                                                {...field} />
                                                                    </FormControl>
                                                                    <FormDescription>{t("AudioEngineer.AddAdvert.portfolio-description")}</FormDescription>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                        )}
                                                />

                                                <FormField
                                                        control={addAdvertForm.control}
                                                        name="price"
                                                        render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>{t("AudioEngineer.AddAdvert.price-label")}</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                                placeholder="e.g. 200"
                                                                                type="number"
                                                                                step="1"
                                                                                {...field} />
                                                                    </FormControl>
                                                                    <FormDescription>{t("AudioEngineer.AddAdvert.price-description")}</FormDescription>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                        )}
                                                />

                                                <FormField
                                                        control={addAdvertForm.control}
                                                        name="categoryName"
                                                        render={({field}) => (
                                                                <FormItem className="space-y-3">
                                                                    <FormLabel>{t("AudioEngineer.AddAdvert.category-label")}</FormLabel>
                                                                    <FormControl>
                                                                        <RadioGroup
                                                                                value={field.value}
                                                                                onValueChange={field.onChange}
                                                                                defaultValue={AdvertCategories.Mixing}
                                                                                className="flex flex-col space-y-1"
                                                                        >
                                                                            <FormItem
                                                                                    className="flex items-center space-x-3 space-y-0"
                                                                            >
                                                                                <FormControl>
                                                                                    <RadioGroupItem
                                                                                            value={AdvertCategories.Mixing}/>
                                                                                </FormControl>
                                                                                <FormLabel className="font-normal">
                                                                                    {t("Shared.SeeAllAdverts.category-mixing")}
                                                                                </FormLabel>
                                                                            </FormItem>

                                                                            <FormItem
                                                                                    className="flex items-center space-x-3 space-y-0"
                                                                            >
                                                                                <FormControl>
                                                                                    <RadioGroupItem
                                                                                            value={AdvertCategories.Mastering}/>
                                                                                </FormControl>
                                                                                <FormLabel className="font-normal">
                                                                                    {t("Shared.SeeAllAdverts.category-mastering")}
                                                                                </FormLabel>
                                                                            </FormItem>

                                                                            <FormItem
                                                                                    className="flex items-center space-x-3 space-y-0"
                                                                            >
                                                                                <FormControl>
                                                                                    <RadioGroupItem
                                                                                            value={AdvertCategories.Production}/>
                                                                                </FormControl>
                                                                                <FormLabel className="font-normal">
                                                                                    {t("Shared.SeeAllAdverts.category-production")}
                                                                                </FormLabel>
                                                                            </FormItem>
                                                                        </RadioGroup>
                                                                    </FormControl>
                                                                    <FormDescription>{t("AudioEngineer.AddAdvert.category-description")}</FormDescription>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                        )}
                                                />

                                                <Button type="submit">{t("Common.submit")}</Button>

                                                {error && (
                                                        <Alert variant="default">
                                                            <InfoIcon className="h-4 w-4"/>
                                                            <AlertTitle>{t("Common.info")}</AlertTitle>
                                                            <AlertDescription>
                                                                {error}
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
                                </div>
                        )
                }
            </>
    );
}
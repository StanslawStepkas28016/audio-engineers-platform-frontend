import {useEffect, useState} from "react";
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
import {AlertCircle, Terminal} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {useNavigate} from "react-router-dom";
import {useQuery} from "react-query";
import {Advert} from "@/types/types.ts";

export const AudioEngineerEditAdvert = () => {
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
                .catch(e => setError(e.response.data.ExceptionMessage || "Error loading advert related data.")),
            queryKey: ['idAdvertByIdUserForEdit', userData.idUser]
        }
    );

    const {data: advertData, isLoading: isLoadingAdvertData} = useQuery(
        {
            queryFn:
                async () => await axiosInstance
                    .get(`/advert/${idAdvert}/details`)
                    .then(response => response.data as Advert)
                    .catch(e => setError(e.response.data.ExceptionMessage || "Error loading advert data.")),
            queryKey: ['advertDetails', idAdvert],
            enabled: !!idAdvert
        }
    );

    const editAdvertFormValidationSchema = z.object({
        idUser: z.string(),
        title: z
            .string()
            .min(1, {message: "Title is required"}),
        description: z
            .string()
            .min(1, {message: "Description is required"})
            .max(1500, {message: "Description can’t exceed 1500 characters"}),
        portfolioUrl: z
            .string()
            .min(1, {message: "Your portfolio Url is required"})
            .max(450)
            .url({message: "Please enter a valid playlist URL (e.g. https://…)"}),
        price: z
            .coerce
            .number({invalid_type_error: "Price must be a number"})
            .min(1, {message: "Price must be at least 1"})
            .max(1500, {message: "Price can’t exceed 1500"}),
    });

    const editAdvertForm = useForm<z.infer<typeof editAdvertFormValidationSchema>>({
        resolver: zodResolver(editAdvertFormValidationSchema),
        defaultValues: {
            idUser: "",
            title: "",
            description: "",
            portfolioUrl: "",
            price: 0
        }
    });

    useEffect(() => {
        if (advertData) {
            editAdvertForm.reset({
                idUser: userData.idUser,
                title: advertData.title,
                description: advertData.description,
                portfolioUrl: advertData.portfolioUrl,
                price: advertData.price
            });
        }
    }, [advertData]);

    const handleSubmit = async () => {
        setEditingError("");
        setSuccess("");

        if (!editAdvertForm.formState.dirtyFields) {
            setEditingError("You must change at least one field to update your advert.");
            return;
        }

        await axiosInstance
            .patch(`/advert/${advertData?.idAdvert}`, editAdvertForm.getValues())
            .then(
                () => {
                    setSuccess("Successfully updated your advert!");
                    setTimeout(() => navigate("/"), 1000);
                })
            .catch(
                r =>
                    setError(r.response.data.ExceptionMessage)
            );
    }

    if (isLoadingIdAdvert || isLoadingAdvertData) {
        return <LoadingPage/>;
    }

    return (
        <>
            {error ? (
                <div className="flex flex-col justify-center items-center w-full p-5">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                </div>
            ) : (
                <div className="p-10 md: flex flex-col h-full justify-center">
                    <h1 className="text-3xl font-bold mb-10 text-center">
                        Please enter new information
                    </h1>

                    <Form {...editAdvertForm}>
                        <form onSubmit={editAdvertForm.handleSubmit(handleSubmit)}
                              className="w-full max-w-2xl mx-auto space-y-8 flex flex-col">
                            <FormField
                                control={editAdvertForm.control}
                                name="title"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Current title</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                {...field} />
                                        </FormControl>
                                        <FormDescription>The title of you advert</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={editAdvertForm.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Current description</FormLabel>
                                        <FormControl>
                                            <AutosizeTextarea
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>This is a description of your advert</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={editAdvertForm.control}
                                name="portfolioUrl"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Current Portfolio URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. https://open.spotify.com/playlist/1LBgAu0kv1q7CVzLFRjaUs?si=87c71b8d80d644bc"

                                                type="text"
                                                {...field} />
                                        </FormControl>
                                        <FormDescription>This is a link to your spotify/apple music
                                            playlist</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={editAdvertForm.control}
                                name="price"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Current price</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. 200"
                                                type="number"
                                                step="1"
                                                {...field} />
                                        </FormControl>
                                        <FormDescription>This will be shown as your advert
                                            price</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit">Submit</Button>

                            {editingError && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4"/>
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        {editingError}
                                    </AlertDescription>
                                </Alert>
                            )}
                            {success && (
                                <Alert>
                                    <Terminal className="h-4 w-4"/>
                                    <AlertTitle>Heads up!</AlertTitle>
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
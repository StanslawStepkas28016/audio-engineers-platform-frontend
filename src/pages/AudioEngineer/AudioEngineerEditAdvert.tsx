import {useEffect, useState} from "react";
import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";
import {AdvertData} from "@/pages/Shared/SeeAdvert.tsx";
import {userStore} from "@/lib/userStore.ts";
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
import {LoadingPage} from "@/pages/Shared/LoadingPage.tsx";
import {useNavigate} from "react-router-dom";

export const AudioEngineerEditAdvert = () => {
    const {userData} = userStore();
    const navigate = useNavigate();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [advertData, setAdvertData] = useState<AdvertData | null>(null);


    const formValidationSchema = z.object({
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

    const formData = useForm<z.infer<typeof formValidationSchema>>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            title: advertData?.title,
            description: advertData?.description,
            portfolioUrl: advertData?.portfolioUrl,
            price: Number(advertData?.price) || 0,
        },
    });
    const fetchUserAdvert = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(`/advert/by-id-user/${userData.idUser}`);
            setAdvertData(response.data);
            setIsLoading(false);
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                setError(e.response.data.ExceptionMessage);
            } else {
                console.log(e)
            }
        } finally {
            setIsLoading(false);
        }
    };

    const sendAdvertUpdate = async () => {
        await axiosInstance.patch(`/advert/${advertData?.idAdvert}`, formData.getValues());
    }

    const handleSubmit = async () => {
        if (!formData.formState.isDirty) {
            setError("You must change at least one field to update your advert.");
            return;
        }
        await sendAdvertUpdate();
        setError("");
        setSuccess("Successfully updated your advert!");
        setTimeout(() => navigate("/"), 1000);
    }

    useEffect(() => {
        fetchUserAdvert();
    }, [])

    useEffect(() => {
        formData.reset({
            title: advertData?.title,
            description: advertData?.description,
            portfolioUrl: advertData?.portfolioUrl,
            price: Number(advertData?.price),
        });
    }, [advertData]);

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="text-center mt-5">
                <h1 className="text-3xl font-bold">Edit your advert information!</h1>
            </div>
            <Form {...formData}>
                <form onSubmit={formData.handleSubmit(handleSubmit)}
                      className="w-full max-w-2xl mx-auto space-y-8 flex flex-col p-10">

                    <FormField
                        control={formData.control}
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
                        control={formData.control}
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
                        control={formData.control}
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
                        control={formData.control}
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

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {error}
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
    );
}
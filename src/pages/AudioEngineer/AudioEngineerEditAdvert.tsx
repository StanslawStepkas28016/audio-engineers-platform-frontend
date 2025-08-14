import {useState} from "react";
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
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {useNavigate} from "react-router-dom";

export const AudioEngineerEditAdvert = () => {
    const {userData} = userStore();
    const navigate = useNavigate();
    const [success, setSuccess] = useState("");
    const [editingError, setEditingError] = useState("");
    const [noAdvertPostedError, setNoAdvertPostedError] = useState("");
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

    const form = useForm<z.infer<typeof formValidationSchema>>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: async () => await axiosInstance.get(`/advert/details/${userData.idUser}`)
            .then(response => {
                setAdvertData(response.data);
                return response.data
            })
            .catch(e => {
                    if (isAxiosError(e) && e.response) setNoAdvertPostedError(e.response.data.ExceptionMessage)
                }
            )
            .finally(() => setIsLoading(false))
    });

    const sendAdvertUpdate = async () => {
        await axiosInstance.patch(`/advert/${advertData?.idAdvert}`, form.getValues());
    }

    const handleSubmit = async () => {
        setEditingError("");
        setSuccess("");

        if (!form.formState.dirtyFields) {
            setEditingError("You must change at least one field to update your advert.");
            return;
        }

        await sendAdvertUpdate();
        setEditingError("");
        setSuccess("Successfully updated your advert!");
        setTimeout(() => navigate("/"), 1000);
    }

    if (isLoading) {
        return <LoadingPage/>;
    }

    return (
        <div className="flex flex-col justify-center items-center">
            {noAdvertPostedError ? (
                <div className="flex flex-col justify-center items-center w-full p-5">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {noAdvertPostedError}
                        </AlertDescription>
                    </Alert>
                </div>
            ) : (
                <div className="p-10 md: w-full max-w-2xl mt-5">
                    <h1 className="text-3xl font-bold mb-10 text-center">
                        Please enter new information
                    </h1>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}
                              className="flex flex-col  mx-auto space-y-8">
                            <FormField
                                control={form.control}
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
                                control={form.control}
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
                                control={form.control}
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
                                control={form.control}
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
        </div>
    );
}
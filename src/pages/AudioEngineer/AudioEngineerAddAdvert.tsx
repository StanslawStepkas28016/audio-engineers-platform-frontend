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
import {AlertCircle, CloudUpload, Paperclip, Terminal} from "lucide-react";
import {AdvertCategories} from "@/enums/advert-categories.tsx";
import {AutosizeTextarea} from "@/components/ui/autosize-textarea.tsx";
import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";
import {userStore} from "@/lib/userStore.ts";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {useNavigate} from "react-router-dom";

export const AudioEngineerAddAdvert = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const {userData} = userStore();
    const navigate = useNavigate();

    const dropZoneConfig = {
        maxFiles: 1,
        maxSize: 1024 * 1024 * 4,
        multiple: true,
    };

    const formValidationSchema = z.object({
        title: z
            .string()
            .min(1, {message: "Title is required"}),
        description: z
            .string()
            .min(1, {message: "Description is required"})
            .max(1500, {message: "Description can’t exceed 1500 characters"}),
        coverImageFile: z
            .instanceof(File, {message: "Please select an image file"})
            .refine((file) =>
                    ["image/jpeg", "image/png", "image/gif"].includes(file.type),
                {message: "Only JPG/PNG/GIF allowed"}
            )
            .refine((file) => file.size <= 4 * 1024 * 1024, {
                message: "File must be smaller than 4 MB",
            }),
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
        categoryName: z
            .string(),
    });

    const formData = useForm<z.infer<typeof formValidationSchema>>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            title: "",
            description: "",
            coverImageFile: undefined, // Initially no file selected
            portfolioUrl: "",
            price: 0,
            categoryName: AdvertCategories.Mixing, // Default category
        },
    });

    const handleAddAdvert = async () => {
        setError("");
        setSuccess("");

        try {
            // Payload preparation
            const payload = new FormData();
            payload.append("idUser", String(userData?.idUser));
            payload.append("title", formData.getValues("title"));
            payload.append("description", formData.getValues("description"));
            payload.append("portfolioUrl", formData.getValues("portfolioUrl"));
            payload.append("price", String(formData.getValues("price")));
            payload.append("categoryName", formData.getValues("categoryName"));
            payload.append("coverImageFile", formData.getValues("coverImageFile"));

            // Sending the request
            const response = await axiosInstance.post(
                "advert/create",
                payload,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log(response);
            setSuccess("Successfully created your advert!");
            setTimeout(() => navigate("/"), 1000);
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                const exceptionMessage = e.response.data.ExceptionMessage;
                setError(exceptionMessage);
            } else {
                console.log(e);
            }
        }
    }

    return (

        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="text-center mt-5 -mb-10">
                <h1 className="text-3xl font-bold">Fill in your advert information!</h1>
            </div>
            <Form {...formData}>
                <form onSubmit={formData.handleSubmit(handleAddAdvert)}
                      className="space-y-8 mx-auto py-10">
                    <FormField
                        control={formData.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. I will mix your song for cheap!"

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
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <AutosizeTextarea
                                        placeholder="e.g I have been mixing song for more than 15 years.."
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
                        name="coverImageFile"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Select a cover image file</FormLabel>
                                <FormControl>
                                    <Controller
                                        control={formData.control}
                                        name="coverImageFile"
                                        defaultValue={undefined}
                                        render={({field: {value, onChange}}) => (
                                            <FileUploader
                                                value={value ? [value] : []}
                                                onValueChange={(files) => {
                                                    // pick first file (or null)
                                                    onChange(files && files[0] ? files[0] : null);
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
                                                        <p className="mb-1 text-sm ">
                                                            <span>Click to upload</span>
                                                            &nbsp; or drag and drop
                                                        </p>
                                                        <p className="text-xs ">
                                                            SVG, PNG, JPG or GIF
                                                        </p>
                                                    </div>
                                                </FileInput>
                                                <FileUploaderContent>
                                                    {value && (
                                                        <FileUploaderItem index={0}>
                                                            <Paperclip className="h-4 w-4 stroke-current"/>
                                                            <span>{value.name}</span>
                                                        </FileUploaderItem>
                                                    )}
                                                </FileUploaderContent>
                                            </FileUploader>
                                        )}
                                    />
                                </FormControl>
                                <FormDescription>This image will be visible in your advert</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={formData.control}
                        name="portfolioUrl"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Portfolio URL</FormLabel>
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
                                <FormLabel>Price</FormLabel>
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

                    <FormField
                        control={formData.control}
                        name="categoryName"
                        render={({field}) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Category</FormLabel>
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
                                                <RadioGroupItem value={AdvertCategories.Mixing}/>
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {AdvertCategories.Mixing}
                                            </FormLabel>
                                        </FormItem>

                                        <FormItem
                                            className="flex items-center space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                                <RadioGroupItem value={AdvertCategories.Mastering}/>
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {AdvertCategories.Mastering}
                                            </FormLabel>
                                        </FormItem>

                                        <FormItem
                                            className="flex items-center space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                                <RadioGroupItem value={AdvertCategories.Production}/>
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {AdvertCategories.Production}
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormDescription>Pick your advert category</FormDescription>
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
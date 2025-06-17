"use client"
import React, {
    useState
} from "react"
import {
    toast
} from "sonner"
import {
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
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AudioEngineerAppSideBar} from "@/components/audio-engineer-app-side-bar.tsx";
import {SiteHeader} from "@/components/site-header.tsx";
import {FileInput, FileUploader, FileUploaderContent, FileUploaderItem} from "@/components/ui/file-upload-custom.tsx";
import {CloudUpload, Paperclip} from "lucide-react";
import {PhoneInput} from "@/components/ui/phone-input.tsx";

const formSchema = z.object({
    name_6958949202: z.string().min(1),
    description: z.string().min(1).max(1500),
    coverImage: z.string(),
    portfolioUrl: z.string().min(1),
    price: z.string(),
    categoryName: z.string()
});

export const AudioEngineerAddAdvertPage = () => {
    const [files, setFiles] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 1,
        maxSize: 1024 * 1024 * 4,
        multiple: true,
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
            );
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AudioEngineerAppSideBar variant="inset"/>
            <SidebarInset>
                <SiteHeader/>
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="flex flex-col items-center gap-2 text-center -mb-10">
                                <h1 className="text-3xl font-bold">Fill in your advert information!</h1>
                            </div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}
                                      className="space-y-8 max-w-3xl mx-auto py-10">

                                    <FormField
                                        control={form.control}
                                        name="name_6958949202"
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
                                        control={form.control}
                                        name="description"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g I have been mixing song for more than 15 years.."

                                                        type="text"
                                                        {...field} />
                                                </FormControl>
                                                <FormDescription>This is a description of your advert</FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                   {/*                 <FormField
                                        // control={form.control}
                                        name="phoneNumber"
                                        render={({field}) => (
                                            <FormItem className="flex flex-col items-start">
                                                <FormLabel>Phone number</FormLabel>
                                                <FormControl className="w-full">
                                                    <PhoneInput
                                                        placeholder="696784867"
                                                        {...field}
                                                        defaultCountry="PL"
                                                    />
                                                </FormControl>
                                                <FormDescription>Enter your phone number.</FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />*/}

                                    <FormField
                                        control={form.control}
                                        name="coverImage"
                                        // TODO: Add File validation
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Select a cover image file</FormLabel>
                                                <FormControl>
                                                    <FileUploader
                                                        value={files}
                                                        onValueChange={setFiles}
                                                        dropzoneOptions={dropZoneConfig}
                                                        className="relative bg-background rounded-lg p-2"
                                                    >
                                                        <FileInput
                                                            id="fileInput"
                                                            className="outline-dashed outline-1"
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
                                                            {files &&
                                                                files.length > 0 &&
                                                                files.map((file, i) => (
                                                                    <FileUploaderItem key={i} index={i}>
                                                                        <Paperclip className="h-4 w-4 stroke-current"/>
                                                                        <span>{file.name}</span>
                                                                    </FileUploaderItem>
                                                                ))}
                                                        </FileUploaderContent>
                                                    </FileUploader>
                                                </FormControl>
                                                <FormDescription>This image will be visible in your
                                                    advert</FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="portfolioUrl"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Potfolio URL</FormLabel>
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
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. 200"
                                                        type="text"
                                                        {...field} />
                                                </FormControl>
                                                <FormDescription>This will be shown as your advert
                                                    price</FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="categoryName"
                                        render={({field}) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Category</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        {[
                                                            ["Mixing", "Mixing"],
                                                            ["Mastering", "Mastering"],
                                                            ["Production", "Production"]
                                                        ].map((option, index) => (
                                                            <FormItem className="flex items-center space-x-3 space-y-0"
                                                                      key={index}>
                                                                <FormControl>
                                                                    <RadioGroupItem value={option[1]}/>
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    {option[0]}
                                                                </FormLabel>
                                                            </FormItem>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormDescription>Pick your advert category</FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit">Submit</Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>

    )
}
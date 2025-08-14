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
import {useForm} from "react-hook-form";
import {AlertCircle, Terminal} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {userStore} from "@/lib/userStore.ts";
import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";

export const ResetEmail = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const {logout, userData} = userStore();

    const resetEmailFormValidationSchema = z.object({
        newEmail: z.string().min(10),
    });

    const resetEmailForm = useForm<z.infer<typeof resetEmailFormValidationSchema>>({
        resolver: zodResolver(resetEmailFormValidationSchema),
        defaultValues: {newEmail: userData.email},
    });

    const handleResetEmailForm = async () => {
        setError("");
        setSuccess("");

        if (!resetEmailForm.formState.isDirty) {
            setError("Your new email needs to be different!")
            return;
        }

        try {
            await axiosInstance.patch(`auth/${userData.idUser}/reset-email`, resetEmailForm.getValues());
            alert("You will be logged out, please check your email inbox for instructions.");
            await logout();
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                const exceptionMessage = e.response.data.ExceptionMessage;
                setError(exceptionMessage);
            } else {
                console.log(e);
            }
        }
    }

    return (<div className="p-10 md: flex flex-col h-full justify-center">
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-10">
                Email address reset form
            </h1>
            <p className="my-10 text-muted-foreground text-xl">
                After submitting the form, an email containing a confirmation link will <br/>
                be sent to your new email address. Your current email address is displayed below.
            </p>
        </div>

        <Form {...resetEmailForm}>
            <form onSubmit={resetEmailForm.handleSubmit(handleResetEmailForm)}
                  className="w-full max-w-2xl mx-auto space-y-8 flex flex-col">
                <FormField
                    control={resetEmailForm.control}
                    name="newEmail"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="email@soundbest.pl"
                                    type="text"
                                    {...field} />
                            </FormControl>
                            <FormDescription>
                                This address will be displayed to other users.
                            </FormDescription>
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
    </div>);
}
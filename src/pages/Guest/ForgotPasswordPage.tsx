import {useState} from "react";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {isAxiosError} from "axios";
import {Navbar} from "@/components/ui/navbar.tsx";
import {
    useForm
} from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Terminal} from "lucide-react";

export const ForgotPasswordPage = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const forgotPasswordFormValidationSchema = z.object({
        email: z.string().min(1, "Password must be at least 8 characters long"),
    });

    const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordFormValidationSchema>>({
        resolver: zodResolver(forgotPasswordFormValidationSchema),
        defaultValues: {
            email: "",
        },
    });

    const handleForgotPasswordForm = async () => {
        setError("");
        setSuccess("");

        try {
            // await axiosInstance.patch(`/auth/${userData.idUser}/reset-password`, forgotPasswordForm.getValues());
            alert("You will be logged out, please check your email inbox for instructions.");
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                setError(e.response.data.ExceptionMessage);
            } else {
                console.log(e);
            }
        }
    }

    return (
        <div>
            <Navbar/>
            <div className="p-10 md: flex flex-col min-h-screen  items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-10">
                        Forgot password form
                    </h1>
                    <p className="my-10 text-muted-foreground text-xl">
                        In order to reset your forgotten password, please fill in your email address. <br/>
                        An email message will be sent to your inbox containing further instructions.
                    </p>
                </div>
                <Form {...forgotPasswordForm}>
                    <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPasswordForm)}
                          className="w-full max-w-2xl mx-auto space-y-8 flex flex-col">
                        <FormField
                            control={forgotPasswordForm.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Your email address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g me@soundbest.pl"
                                            type="email"
                                            {...field} />
                                    </FormControl>
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

                {error &&
                    <div className="p-10 md:w-xl">
                        <Alert variant="destructive" className="mt-5">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    </div>
                }
            </div>
        </div>
    );
}
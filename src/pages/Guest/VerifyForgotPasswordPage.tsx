import {Button} from "@/components/ui/button.tsx";
import {Navbar} from "@/components/ui/navbar.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Terminal} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input.tsx";
import {axiosInstance} from "@/lib/axios.ts";

export const VerifyForgotPasswordPage = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const {forgotPasswordToken} = useParams<{ forgotPasswordToken: string }>();
    const navigate = useNavigate();

    const verifyForgotPasswordFormValidationSchema = z.object({
        newPassword: z.string().min(8, "Password must be at least 8 characters long."),
        newPasswordRepeated: z.string().min(8, "Password repeated must be at least 8 characters long."),
    });

    const verifyForgotPasswordForm = useForm<z.infer<typeof verifyForgotPasswordFormValidationSchema>>({
        resolver: zodResolver(verifyForgotPasswordFormValidationSchema),
        defaultValues: {
            newPassword: "",
            newPasswordRepeated: ""
        }
    });

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        await axiosInstance
            .post(`auth/${forgotPasswordToken}/verify-forgot-password`, verifyForgotPasswordForm.getValues())
            .then(() => {
                setSuccess("Successfully set your new password, you will be redirected to login again.");
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            })
            .catch(e => setError(e.response.data.ExceptionMessage || "Error setting your new password."));
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar/>
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">

                <div className="text-center my-10">
                    <h1 className="text-3xl font-bold">
                        New password form
                    </h1>
                    <p className="my-10 text-muted-foreground text-xl">
                        Please set your new password, you will be redirected to login after that.
                    </p>
                </div>

                <Form {...verifyForgotPasswordForm}>
                    <form onSubmit={verifyForgotPasswordForm.handleSubmit(handleSubmit)}
                          className="w-full max-w-2xl mx-auto space-y-8 flex flex-col"
                    >
                        <FormField
                            control={verifyForgotPasswordForm.control}
                            name="newPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>New password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="**********"
                                            type="password"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>

                        <FormField
                            control={verifyForgotPasswordForm.control}
                            name="newPasswordRepeated"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>New password repeated</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="**********"
                                            type="password"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>

                        <Button type="submit">
                            Submit
                        </Button>

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
        </div>
    );
}
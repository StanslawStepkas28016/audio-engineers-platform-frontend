import {useState} from "react";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
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
import {axiosInstance} from "@/lib/axios.ts";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

export const ForgotPasswordPage = () => {
    const {t} = useTranslation();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const forgotPasswordFormValidationSchema = z.object({
        email: z.string().email(t("Guest.ForgotPassword.error-invalid-email")),
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

        await axiosInstance
                .post(`auth/forgot-password`, forgotPasswordForm.getValues())
                .then(() => {
                    setSuccess(t("Guest.ForgotPassword.success"));
                    setTimeout(() => {
                        navigate("/");
                    }, 2000);
                })
                .catch(e => {
                    let key = "Guest.ForgotPassword.error-fallback";

                    const exceptionMessage = e.response.data.ExceptionMessage.toLowerCase();

                    if (exceptionMessage.includes("user")) {
                        key = "Guest.ForgotPassword.error-user-not-found";
                    }

                    setError(t(key));
                });
    }

    return (
            <div className="flex flex-col min-h-screen">
                <Navbar/>
                <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-10">
                            {t("Guest.ForgotPassword.form")}
                        </h1>
                        <p className="my-10 text-muted-foreground text-xl whitespace-pre-line">
                            {t("Guest.ForgotPassword.description")}
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
                                                <FormLabel>{t("Guest.ForgotPassword.email-label")}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                            placeholder="me@soundbest.pl"
                                                            type="email"
                                                            {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                    )}
                            />

                            <Button type="submit">{t("Common.submit")}</Button>

                            {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4"/>
                                        <AlertTitle>{t("Common.error")}</AlertTitle>
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
    );
}
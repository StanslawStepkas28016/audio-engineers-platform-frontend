import {Navbar} from "@/components/ui/navbar.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from "lucide-react";
import {useUserStore} from "@/stores/useUserStore.ts";
import {Link} from "react-router-dom";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    useForm
} from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {useTranslation} from "react-i18next";

export const LoginPage = () => {
    const {t} = useTranslation();

    const {login, error} = useUserStore();

    const loginFormValidationSchema = z.object({
        email: z.string().email(t("Guest.Login.error-invalid-email")),
        password: z.string().min(2, t("Guest.Login.error-password-len"))
    });

    const loginForm = useForm<z.infer<typeof loginFormValidationSchema>>({
        resolver: zodResolver(loginFormValidationSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const handleSubmit = async () => {
        await login(
                loginForm.getValues().email,
                loginForm.getValues().password
        );
    }

    return (
            <div className="flex flex-col min-h-screen">
                <Navbar/>
                <main className="flex-1 flex w-full items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-sm">
                        <div className="flex flex-col gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl center flex justify-center">
                                        {t("Guest.Login.good-to-see")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Form {...loginForm}>
                                        <form onSubmit={loginForm.handleSubmit(handleSubmit)}
                                              className="w-full max-w-2xl mx-auto space-y-8 flex flex-col">
                                            <FormField
                                                    control={loginForm.control}
                                                    name="email"
                                                    render={({field}) => (
                                                            <FormItem>
                                                                <FormLabel>E-mail</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                            placeholder="me@soundbest.pl"
                                                                            type="email"
                                                                            {...field} />
                                                                </FormControl>
                                                                <FormDescription>{t("Guest.Login.email-description")}</FormDescription>
                                                                <FormMessage/>
                                                            </FormItem>
                                                    )}
                                            />

                                            <FormField
                                                    control={loginForm.control}
                                                    name="password"
                                                    render={({field}) => (
                                                            <FormItem>
                                                                <FormLabel>{t("Guest.Login.password-label")}</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                            placeholder="*********"
                                                                            type="password"
                                                                            {...field} />
                                                                </FormControl>
                                                                <FormDescription>{t("Guest.Login.password-description-pt-1")} {" "}
                                                                    <Link to="/forgot-password"
                                                                          className="underline underline-offset-4">
                                                                        {t("Guest.Login.password-description-pt-2")}
                                                                    </Link>
                                                                </FormDescription>
                                                                <FormMessage/>
                                                            </FormItem>
                                                    )}
                                            />

                                            <Button type="submit">{t("Common.submit")}</Button>
                                        </form>
                                        <div className="mt-4 text-center text-sm">
                                            {t("Guest.Login.dont-have-account-pt-1")} {" "}
                                            <Link to="/register"
                                                  className="underline underline-offset-4">
                                                {t("Guest.Login.dont-have-account-pt-2")}
                                            </Link>
                                        </div>
                                    </Form>
                                </CardContent>
                            </Card>
                            // TODO: Add info of success.
                            {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4"/>
                                        <AlertTitle>{t("Common.error")}</AlertTitle>
                                        <AlertDescription>
                                            {t("Guest.Login.error-invalid-credentials")}
                                        </AlertDescription>
                                    </Alert>
                            )}
                        </div>
                    </div>
                </main>
            </div>
    );
}
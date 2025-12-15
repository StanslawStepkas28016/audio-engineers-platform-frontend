import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
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
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Terminal} from "lucide-react";
import {useState} from "react";
import {axiosInstance} from "@/lib/axios.ts";
import {useTranslation} from "react-i18next";

export const ResetPassword = () => {
    const {t} = useTranslation();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const passwordFormValidationSchema = z.object({
        currentPassword: z
                .string()
                .min(1, t("Shared.ResetPassword.current-password-required")),

        newPassword: z
                .string()
                .min(8, t("Shared.ResetPassword.new-password-min-length")),

        newPasswordRepeated: z
                .string()
                .min(8, t("Shared.ResetPassword.repeat-password-min-length")),
    });


    const resetPasswordForm = useForm<z.infer<typeof passwordFormValidationSchema>>({
        resolver: zodResolver(passwordFormValidationSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            newPasswordRepeated: "",
        },
    });

    const handleResetPasswordFormSubmit = async () => {
        setError("");
        setSuccess("");

        const values = resetPasswordForm.getValues();

        if (values.newPassword!==values.newPasswordRepeated) {
            setError(t("Shared.ResetPassword.password-must-match"));
            return;
        }

        await axiosInstance
                .patch(`/auth/reset-password`, resetPasswordForm.getValues())
                .then(() => {
                    setSuccess(t("Shared.ResetPassword.success-message"));
                    setTimeout(() => window.location.reload(), 1000);
                })
                .catch((e) =>
                        setError(e.response?.data?.ExceptionMessage || t("Shared.ResetPassword.error-generic"))
                );
    };

    return (
            <div className="p-10 md: flex flex-col h-full justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">
                        {t("Shared.ResetPassword.title")}
                    </h1>
                    <p className="my-10 text-muted-foreground text-xl whitespace-pre-line">
                        {t("Shared.ResetPassword.description")}
                    </p>
                </div>

                <Form {...resetPasswordForm}>
                    <form
                            onSubmit={resetPasswordForm.handleSubmit(handleResetPasswordFormSubmit)}
                            className="w-full max-w-2xl mx-auto space-y-8 flex flex-col"
                    >
                        <FormField
                                control={resetPasswordForm.control}
                                name="currentPassword"
                                render={({field}) => (
                                        <FormItem>
                                            <FormLabel>{t("Shared.ResetPassword.current-password-label")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                        placeholder={t("Shared.ResetPassword.current-password-label")}
                                                        type="password"
                                                        {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                )}
                        />

                        <FormField
                                control={resetPasswordForm.control}
                                name="newPassword"
                                render={({field}) => (
                                        <FormItem>
                                            <FormLabel>{t("Shared.ResetPassword.new-password-label")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                        placeholder={t("Shared.ResetPassword.new-password-label")}
                                                        type="password"
                                                        {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                )}
                        />

                        <FormField
                                control={resetPasswordForm.control}
                                name="newPasswordRepeated"
                                render={({field}) => (
                                        <FormItem>
                                            <FormLabel>{t("Shared.ResetPassword.repeat-new-password-label")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                        placeholder={t("Shared.ResetPassword.repeat-new-password-label")}
                                                        type="password"
                                                        {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                {t("Shared.ResetPassword.complex-password-hint")}
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                )}
                        />

                        <Button type="submit">
                            {t("Common.submit")}
                        </Button>

                        {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4"/>
                                    <AlertTitle>
                                        {t("Common.error")}
                                    </AlertTitle>
                                    <AlertDescription>
                                        {error}
                                    </AlertDescription>
                                </Alert>
                        )}

                        {success && (
                                <Alert>
                                    <Terminal className="h-4 w-4"/>
                                    <AlertTitle>
                                        {t("Shared.ResetPassword.success-title")}
                                    </AlertTitle>
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
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
import {useUserStore} from "@/stores/useUserStore.ts";
import {axiosInstance} from "@/lib/axios.ts";
import {useTranslation} from "react-i18next";

export const ResetEmail = () => {
    const {t} = useTranslation();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const {userData} = useUserStore();

    const resetEmailFormValidationSchema = z.object({
        newEmail: z
                .string()
                .min(10, t("Shared.ResetEmail.new-email-min-length")),
    });

    const resetEmailForm = useForm<z.infer<typeof resetEmailFormValidationSchema>>({
        resolver: zodResolver(resetEmailFormValidationSchema),
        defaultValues: {newEmail: userData.email},
    });

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        if (userData.email===resetEmailForm.getValues().newEmail) {
            setError(t("Shared.ResetEmail.not-different-error"));
            return;
        }

        await axiosInstance
                .patch(`auth/reset-email`, resetEmailForm.getValues())
                .then(() => {
                    setSuccess(t("Shared.ResetEmail.success-message"));
                    setTimeout(() => window.location.reload(), 1000);
                })
                .catch((e) =>
                        setError(e.response?.data?.ExceptionMessage || t("Shared.ResetEmail.error-generic"))
                );
    };

    return (
            <div className="p-10 md: flex flex-col h-full justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-10">
                        {t("Shared.ResetEmail.title")}
                    </h1>
                    <p className="my-10 text-muted-foreground text-xl whitespace-pre-line">
                        {t("Shared.ResetEmail.description")}
                    </p>
                </div>

                <Form {...resetEmailForm}>
                    <form
                            onSubmit={resetEmailForm.handleSubmit(handleSubmit)}
                            className="w-full max-w-2xl mx-auto space-y-8 flex flex-col"
                    >
                        <FormField
                                control={resetEmailForm.control}
                                name="newEmail"
                                render={({field}) => (
                                        <FormItem>
                                            <FormLabel>{t("Shared.ResetEmail.email-label")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                        placeholder={t("Shared.ResetEmail.placeholder")}
                                                        type="text"
                                                        {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                {t("Shared.ResetEmail.public-description")}
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
    );
};
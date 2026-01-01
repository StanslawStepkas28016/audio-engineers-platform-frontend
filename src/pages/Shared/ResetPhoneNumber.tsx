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
import {PhoneInput} from "@/components/ui/phone-input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Terminal} from "lucide-react";
import {useUserStore} from "@/stores/useUserStore.ts";
import {useState} from "react";
import {axiosInstance} from "@/lib/axios.ts";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

export const ResetPhoneNumber = () => {
    const {t} = useTranslation();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const {checkAuth, userData} = useUserStore();

    const resetPhoneNumberFormValidationSchema = z.object({
        newPhoneNumber: z
                .string()
                .min(9, t("Shared.ResetPhoneNumber.min-length")),
    });

    const resetPhoneNumberForm = useForm<
            z.infer<typeof resetPhoneNumberFormValidationSchema>
    >({
        resolver: zodResolver(resetPhoneNumberFormValidationSchema),
        defaultValues: {newPhoneNumber: userData.phoneNumber},
    });

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        if (userData.phoneNumber===resetPhoneNumberForm.getValues().newPhoneNumber) {
            setError(t("Shared.ResetPhoneNumber.not-different-error"));
            return;
        }

        await axiosInstance
                .patch(`auth/reset-phone-number`, resetPhoneNumberForm.getValues())
                .then(() => {
                    setSuccess(t("Shared.ResetPhoneNumber.success-message"));
                    setTimeout(async () => {
                        await checkAuth();
                        navigate("/");
                    }, 1000);
                })
                .catch((e) =>
                        setError(
                                e.response?.data?.ExceptionMessage ||
                                t("Shared.ResetPhoneNumber.error-generic")
                        )
                );
    };

    return (
            <div className="p-10 md: flex flex-col h-full justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-10">
                        {t("Shared.ResetPhoneNumber.title")}
                    </h1>
                    <p className="my-10 text-muted-foreground text-xl">
                        {t("Shared.ResetPhoneNumber.description")}
                    </p>
                </div>

                <Form {...resetPhoneNumberForm}>
                    <form
                            onSubmit={resetPhoneNumberForm.handleSubmit(handleSubmit)}
                            className="w-full max-w-2xl mx-auto space-y-8 flex flex-col"
                    >
                        <FormField
                                control={resetPhoneNumberForm.control}
                                name="newPhoneNumber"
                                render={({field}) => (
                                        <FormItem>
                                            <FormLabel>{t("Shared.ResetPhoneNumber.phone-label")}</FormLabel>
                                            <FormControl>
                                                <PhoneInput
                                                        placeholder={t("Shared.ResetPhoneNumber.placeholder")}
                                                        defaultCountry="PL"
                                                        {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                {t("Shared.ResetPhoneNumber.public-description")}
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
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                        )}

                        {success && (
                                <Alert>
                                    <Terminal className="h-4 w-4"/>
                                    <AlertTitle>
                                        {t("Common.success")}
                                    </AlertTitle>
                                    <AlertDescription>{success}</AlertDescription>
                                </Alert>
                        )}
                    </form>
                </Form>
            </div>
    );
}
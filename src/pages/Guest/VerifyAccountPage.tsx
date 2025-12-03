import {Navbar} from "@/components/ui/navbar.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {axiosInstance} from "@/lib/axios.ts";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Terminal} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form.tsx";
import {useTranslation} from "react-i18next";

export const VerifyAccountPage = () => {
    const {t} = useTranslation();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const verifyAccountFormValidationSchema = z.object({
        verificationCode: z.string().length(6, "Verification code must be 6 digits"),
    });

    const verifyAccountForm = useForm<z.infer<typeof verifyAccountFormValidationSchema>>({
        resolver: zodResolver(verifyAccountFormValidationSchema),
        defaultValues: {
            verificationCode: "",
        }
    });

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        await axiosInstance
                .post("auth/verify-account", verifyAccountForm.getValues())
                .then(() => {
                    setSuccess(t("Guest.VerifyAccount.success"));
                    setTimeout(() => navigate("/login"), 1000);
                })
                .catch(e => {
                    let key = "Guest.VerifyAccount.error-fallback";

                    const exceptionMessage = e.response.data.ExceptionMessage.toLowerCase();

                    if (exceptionMessage.includes("invalid")) {
                        key = "Guest.VerifyAccount.error-invalid-code";
                    }
                    else if (exceptionMessage.includes("phone")) {
                        key = "Guest.VerifyAccount.error-expired-code";
                    }

                    setError(t(key));
                });
    }

    return (
            <div className="flex flex-col min-h-screen">
                <Navbar/>
                <main className="flex-1 flex w-full items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-sm">
                        <Form {...verifyAccountForm}>
                            <form
                                    className="flex flex-col gap-6 items-center"
                                    onSubmit={verifyAccountForm.handleSubmit(handleSubmit)}
                            >
                                <div
                                        className="hidden lg:flex h-full justify-end items-center overflow-hidden -mt-30 -mb-10">
                                    <img
                                            src="/src/assets/coding.png"
                                            alt="decoration"
                                            className="object-contain filter dark:invert"
                                    />
                                </div>

                                <FormField
                                        control={verifyAccountForm.control}
                                        name="verificationCode"
                                        render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <InputOTP
                                                                maxLength={6}
                                                                {...field}
                                                        >
                                                            <InputOTPGroup>
                                                                <InputOTPSlot index={0}/>
                                                                <InputOTPSlot index={1}/>
                                                                <InputOTPSlot index={2}/>
                                                            </InputOTPGroup>
                                                            <InputOTPSeparator/>
                                                            <InputOTPGroup>
                                                                <InputOTPSlot index={3}/>
                                                                <InputOTPSlot index={4}/>
                                                                <InputOTPSlot index={5}/>
                                                            </InputOTPGroup>
                                                        </InputOTP>
                                                    </FormControl>
                                                </FormItem>
                                        )}
                                />

                                <h1 className="text-center text-sm text-muted-foreground">
                                    {t("Guest.VerifyAccount.enter")}
                                </h1>

                                <Button type="submit" className="w-full">
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
                </main>
            </div>
    );
}
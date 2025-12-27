import {axiosInstance} from "@/lib/axios.ts";
import {Navbar} from "@/components/ui/navbar.tsx";
import {useNavigate} from "react-router-dom";
import {Input} from "@/components/ui/input.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Terminal} from "lucide-react";
import {AppRoles} from "@/enums/app-roles.tsx";
import {PhoneInput} from "@/components/ui/phone-input.tsx";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useTranslation} from "react-i18next";


export const RegisterPage = () => {
    const {t} = useTranslation();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const formValidationSchema = z.object({
        email: z.string().email(t("Guest.Register.error-email-invalid")),
        firstName: z.string().min(1, t("Guest.Register.error-first-name-min")).max(100, t("Guest.Register.error-first-name-max")),
        lastName: z.string().min(1, t("Guest.Register.error-last-name-min")).max(100, t("Guest.Register.error-last-name-max")),
        phoneNumber: z.string().min(9, t("Guest.Register.error-phone-numer-len")),
        password: z.string().min(6, t("Guest.Register.error-password-min")),
        roleName: z.string()
    });

    const form = useForm<z.infer<typeof formValidationSchema>>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            password: "",
            roleName: AppRoles.Client,
        },
    });

    const handleRegister = async () => {
        setError("");
        setSuccess("");

        await axiosInstance.post("auth/register", form.getValues())
                .then(() => {
                    setSuccess(t("Guest.Register.success"));
                    setTimeout(() => navigate("/verify-account"), 1000);
                })
                .catch(e => {
                    let key = "Guest.Register.error-fallback";

                    const exceptionMessage = e.response.data.ExceptionMessage.toLowerCase();

                    if (exceptionMessage.includes("email")) {
                        key = "Guest.Register.error-email-taken";
                    }
                    else if (exceptionMessage.includes("phone")) {
                        key = "Guest.Register.error-phone-number-taken";
                    }

                    setError(t(key));
                });
    }

    return (
            <div className="flex flex-col min-h-screen">
                <Navbar/>
                <div className="flex-1 flex flex-col items-center justify-center p-10">
                    <div className="flex flex-1 items-center justify-center">
                        <Form {...form}>
                            <form className="space-y-8"
                                  onSubmit={form.handleSubmit(handleRegister)}>
                                <h1 className="text-2xl md:text-2xl lg:text-3xl font-bold text-center">
                                    {t("Guest.Register.provide-us")}
                                </h1>

                                <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                                placeholder="email@soundbest.pl"
                                                                type="text"
                                                                {...field} />
                                                    </FormControl>
                                                    <FormDescription>{t("Guest.Register.email-description")}</FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                        )}
                                />
                                <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>{t("Guest.Register.first-name-label")}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                                placeholder={t("Guest.Register.first-name-placeholder")}
                                                                type="text"
                                                                {...field} />
                                                    </FormControl>
                                                    <FormDescription>{t("Guest.Register.first-name-description")}</FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                        )}
                                />
                                <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>{t("Guest.Register.last-name-label")}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                                placeholder={t("Guest.Register.last-name-placeholder")}
                                                                type="text"
                                                                {...field} />
                                                    </FormControl>
                                                    <FormDescription>{t("Guest.Register.first-name-description")}</FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                        )}
                                />
                                <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>{t("Guest.Register.phone-number-label")}</FormLabel>
                                                    <FormControl>
                                                        <PhoneInput
                                                                placeholder="696 784 867"
                                                                defaultCountry="PL"
                                                                {...field} />
                                                    </FormControl>
                                                    <FormDescription>{t("Guest.Register.phone-number-description")}</FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                        )}
                                />
                                <FormField
                                        control={form.control}
                                        name="password"
                                        render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>{t("Guest.Register.password-label")}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                                placeholder="**********"
                                                                type="password"
                                                                {...field} />
                                                    </FormControl>
                                                    <FormDescription>{t("Guest.Register.password-description")}</FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                        )}
                                />
                                <FormField
                                        control={form.control}
                                        name="roleName"
                                        render={({field}) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel>{t("Guest.Register.what-do-you-want")}</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                                onValueChange={field.onChange}
                                                                defaultValue={AppRoles.Client}
                                                                className="flex flex-col space-y-1"
                                                        >
                                                            <FormItem
                                                                    className="flex items-center space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <RadioGroupItem value={AppRoles.AudioEngineer}/>
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    {t("Guest.Register.what-do-you-want-opt-engineer")}
                                                                </FormLabel>
                                                            </FormItem>

                                                            <FormItem
                                                                    className="flex items-center space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <RadioGroupItem value={AppRoles.Client}/>
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    {t("Guest.Register.what-do-you-want-opt-client")}
                                                                </FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                        )}
                                />
                                <Button type="submit" className="w-full">
                                    {t("Guest.Register.sign-up")}
                                </Button>
                            </form>

                        </Form>
                    </div>
                    <div className="mt-10">
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
                    </div>
                </div>
            </div>
    );
}
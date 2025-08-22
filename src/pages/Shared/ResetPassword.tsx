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
import {useUserStore} from "@/stores/useUserStore.ts";
import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";

export const ResetPassword = () => {
    const {userData, logout} = useUserStore();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const passwordFormValidationSchema = z.object({
        currentPassword: z.string().min(1, "Password must be at least 8 characters long"),
        newPassword: z.string().min(8, "Password must be at least 8 characters long"),
        newPasswordRepeated: z.string().min(8, "Password must be at least 8 characters long"),
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

        if (values.newPassword !== values.newPasswordRepeated) {
            setError("Passwords must be identical");
        }

        try {
            await axiosInstance.patch(`/auth/${userData.idUser}/reset-password`, resetPasswordForm.getValues());
            alert("You will be logged out, please check your email inbox for instructions.");
            await logout();
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                setError(e.response.data.ExceptionMessage);
            } else {
                console.log(e);
            }
        }
    }

    return (
        <div className="p-10 md: flex flex-col h-full justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold">
                    Password reset form
                </h1>
                <p className="my-10 text-muted-foreground text-xl">
                    Changing your password will require you to verify your new password <br/>
                    by inputting a code sent to your new email! You will also be <br/>
                    logged out and will need to log in again!
                </p>
            </div>

            <Form {...resetPasswordForm}>
                <form onSubmit={resetPasswordForm.handleSubmit(handleResetPasswordFormSubmit)}
                      className="w-full max-w-2xl mx-auto space-y-8 flex flex-col">
                    <FormField
                        control={resetPasswordForm.control}
                        name="currentPassword"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Current password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="**********"
                                        type="password"
                                        {...field} />
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
                    />

                    <FormField
                        control={resetPasswordForm.control}
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
                                <FormDescription>
                                    Make sure you pick a complex password!
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
        </div>
    );
}
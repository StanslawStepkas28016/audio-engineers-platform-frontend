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
import {userStore} from "@/lib/userStore.ts";
import {PhoneInput} from "@/components/ui/phone-input.tsx";
import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";
import {useNavigate} from "react-router-dom";

export const ChangeData = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const {logout, userData} = userStore();
    const navigate = useNavigate();

    const resetPhoneNumberFormValidationSchema = z.object({
        phoneNumber: z.string().min(1).min(9, "Phone number must be at least 9 characters long"),
    });

    const resetPhoneNumberForm = useForm<z.infer<typeof resetPhoneNumberFormValidationSchema>>({
        resolver: zodResolver(resetPhoneNumberFormValidationSchema),
        defaultValues: {phoneNumber: userData.phoneNumber},
    });


    const resetEmailFormValidationSchema = z.object({
        newEmail: z.string().min(10),
    });

    const resetEmailForm = useForm<z.infer<typeof resetEmailFormValidationSchema>>({
        resolver: zodResolver(resetEmailFormValidationSchema),
        defaultValues: {newEmail: userData.email},
    });

    const passwordFormValidationSchema = z.object({
        password: z.string().min(8, "Password must be at least 8 characters long"),
    });

    const passwordForm = useForm<z.infer<typeof passwordFormValidationSchema>>({
        resolver: zodResolver(passwordFormValidationSchema),
        defaultValues: {password: ""},
    });


    const handleResetEmailForm = async () => {
        setError("");
        setSuccess("");
        try {

            const axiosResponse = await axiosInstance.patch(`auth/${userData.idUser}/reset-email`, resetEmailForm.getValues());
            console.log(axiosResponse);
            await logout();
            navigate("/");
            alert("Please refer to your email inbox for instructions!");
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                const exceptionMessage = e.response.data.ExceptionMessage;
                setError(exceptionMessage);
            } else {
                console.log(e);
            }
        }
    }

    const handleResetPhoneNumberForm = async () => {
        setError("");
        setSuccess("");
        try {
            // await axiosInstance.patch(`user/${userData.idUser}/change-data`, resetEmailForm.getValues());
            setSuccess("Successfully changed your data!");
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                const exceptionMessage = e.response.data.ExceptionMessage;
                setError(exceptionMessage);
            } else {
                console.log(e);
            }
        }
    }


    const handleResetPasswordFormSubmit = async () => {
        
    }

    return (<div className="flex flex-col p-10">
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-10">
                I want to change my email address
            </h1>
        </div>

        <Form {...resetEmailForm}>
            <form onSubmit={resetEmailForm.handleSubmit(handleResetEmailForm)}
                  className="w-full max-w-2xl mx-auto space-y-8 flex flex-col">
                <FormField
                    control={resetEmailForm.control}
                    name="newEmail"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="email@soundbest.pl"
                                    type="text"
                                    {...field} />
                            </FormControl>
                            <FormDescription>This address will be displayed to other
                                users</FormDescription>
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


        <div className="text-center mt-15">
            <h1 className="text-3xl font-bold mb-10">
                I want to change my phone number
            </h1>
        </div>

        <Form {...resetPhoneNumberForm}>
            <form onSubmit={resetPhoneNumberForm.handleSubmit(handleResetPhoneNumberForm)}
                  className="w-full max-w-2xl mx-auto space-y-8 flex flex-col">
                <FormField
                    control={resetPhoneNumberForm.control}
                    name="phoneNumber"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Phone number</FormLabel>
                            <FormControl>
                                <PhoneInput
                                    placeholder="696 784 867"
                                    defaultCountry="PL"
                                    {...field} />
                            </FormControl>
                            <FormDescription>This number will be visible to other
                                users</FormDescription>
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

        <div className="text-center">
            <h1 className="text-3xl font-bold my-10">
                I want to change my password
            </h1>
            <p className="my-10 text-red-300 text-xl">
                Changing your password will require you to verify your new email address <br/>
                by inputting a code sent to your new email! You will also need to log in again!
            </p>
        </div>


        <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handleResetPasswordFormSubmit)}
                  className="w-full max-w-2xl mx-auto space-y-8 flex flex-col">
                <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="**********"
                                    type="password"
                                    {...field} />
                            </FormControl>
                            <FormDescription>Make sure you go pick a complex
                                password!</FormDescription>
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
    </div>);
}
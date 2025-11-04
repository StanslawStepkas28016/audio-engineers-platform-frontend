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

export const ResetPhoneNumber = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const {checkAuth, userData} = useUserStore();

    const resetPhoneNumberFormValidationSchema = z.object({
        newPhoneNumber: z.string().min(1).min(9, "Phone number must be at least 9 characters long"),
    });

    const resetPhoneNumberForm = useForm<z.infer<typeof resetPhoneNumberFormValidationSchema>>({
        resolver: zodResolver(resetPhoneNumberFormValidationSchema),
        defaultValues: {newPhoneNumber: userData.phoneNumber},
    });

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        if (!resetPhoneNumberForm.formState.dirtyFields) {
            setError("Your new email needs to be different!")
            return;
        }

        await axiosInstance
            .patch(`auth/reset-phone-number`, resetPhoneNumberForm.getValues())
            .then(() => {
                setSuccess("Successfully updated your phone number!");
                setTimeout(async () => {
                    await checkAuth();
                    navigate("/")
                }, 1000);
            })
            .catch(e => setError(e.response.data.ExceptionMessage || "Error resetting phone number."));
    }

    return (<div className="p-10 md: flex flex-col h-full justify-center">
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-10">
                Phone number reset form
            </h1>
            <p className="my-10 text-muted-foreground text-xl">
                Please input your new phone number. <br/>
                Your current number is displayed below.
            </p>
        </div>

        <Form {...resetPhoneNumberForm}>
            <form onSubmit={resetPhoneNumberForm.handleSubmit(handleSubmit)}
                  className="w-full max-w-2xl mx-auto space-y-8 flex flex-col">
                <FormField
                    control={resetPhoneNumberForm.control}
                    name="newPhoneNumber"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Phone number</FormLabel>
                            <FormControl>
                                <PhoneInput
                                    placeholder="696 784 867"
                                    defaultCountry="PL"
                                    {...field} />
                            </FormControl>
                            <FormDescription>
                                This number will be visible to other users.
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

    </div>);
}
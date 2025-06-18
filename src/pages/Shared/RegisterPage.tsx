import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";
import {Navbar} from "@/components/ui/navbar.tsx";
import {useNavigate} from "react-router-dom";
import {Input} from "@/components/ui/input.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Terminal} from "lucide-react";
import {AppRoles} from "@/pages/Shared/enums/app-roles.tsx";
import {PhoneInput} from "@/components/ui/phone-input.tsx";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";


export const RegisterPage = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const formValidationSchema = z.object({
        email: z.string().min(10),
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100),
        phoneNumber: z.string().min(1).min(9, "Phone number must be at least 9 characters long"),
        password: z.string().min(8, "Password must be at least 8 characters long"),
        roleName: z.string()
    });

    const formData = useForm<z.infer<typeof formValidationSchema>>({
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
         try {
             await axiosInstance.post("auth/register", formData.getValues());
             setSuccess("Successfully registered!");
             setTimeout(() => navigate("/verify-account"), 1000);
         } catch (e) {
             if (isAxiosError(e) && e.response) {
                 const exceptionMessage = e.response.data.ExceptionMessage;
                 setError(exceptionMessage);
             } else {
                 console.log(e);
             }
         }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar/>
            <div className="flex-1 grid lg:grid-cols-2 overflow-hidden">
                <div className="flex flex-col items-center gap-2 text-center m-20">
                    <h1 className="text-3xl font-bold mb-5">Provide us your information!</h1>
                    <Form {...formData}>
                        <form className="space-y-8 max-w-3xl mx-auto py-2"
                              onSubmit={formData.handleSubmit(handleRegister)}>
                            <FormField
                                control={formData.control}
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
                                        <FormDescription>This address will be displayed to other
                                            users</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={formData.control}
                                name="firstName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>First name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John"
                                                type="text"
                                                {...field} />
                                        </FormControl>
                                        <FormDescription>Your first name will be visible to other
                                            users</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={formData.control}
                                name="lastName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Last name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Doe"
                                                type="text"
                                                {...field} />
                                        </FormControl>
                                        <FormDescription>Your last name will be visible to other
                                            users</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={formData.control}
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

                            <FormField
                                control={formData.control}
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

                            <FormField
                                control={formData.control}
                                name="roleName"
                                render={({field}) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>What do you want to do?</FormLabel>
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
                                                        I am an audio engineer and I want to advertise my services
                                                    </FormLabel>
                                                </FormItem>

                                                <FormItem
                                                    className="flex items-center space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem value={AppRoles.Client}/>
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        I am a client and I want to find an audio engineer
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Sign up
                            </Button>

                        </form>
                    </Form>
                    <div>
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
                    </div>
                </div>
                <div className="hidden lg:flex h-full justify-end items-center overflow-hidden">
                    <img
                        src="/src/assets/form.jpg"
                        alt="decoration"
                        className="scale-70 object-contain filter dark:invert"
                    />
                </div>
            </div>
        </div>
    );
}
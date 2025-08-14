import {Navbar} from "@/components/ui/navbar.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from "lucide-react";
import {userStore} from "@/lib/userStore.ts";
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

export const LoginPage = () => {
    const {login, error} = userStore();

    const formValidationSchema = z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(2, "Password must be at least 6 characters long")
    });

    const form = useForm<z.infer<typeof formValidationSchema>>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const handleLogin = async () => {
        await login(
            form.getValues().email
            , form.getValues().password
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
                                <CardTitle className="text-2xl center flex justify-center">Good to see you
                                    again!</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleLogin)}
                                          className="w-full max-w-2xl mx-auto space-y-8 flex flex-col">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>E-mail</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="me@soundbest.pl"
                                                            type="text"
                                                            {...field} />
                                                    </FormControl>
                                                    <FormDescription>The mail you provided during singing
                                                        up.</FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="*********"
                                                            type="password"
                                                            {...field} />
                                                    </FormControl>
                                                    <FormDescription>Forgot your password? {" "}
                                                        <Link to="/forgot-password"
                                                              className="underline underline-offset-4">
                                                            Reset it!
                                                        </Link>
                                                    </FormDescription>

                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit"> Submit</Button>
                                    </form>
                                    <div className="mt-4 text-center text-sm">
                                        Don't have an account? {" "}
                                        <Link to="/register"
                                              className="underline underline-offset-4">
                                            Sign up
                                        </Link>
                                    </div>
                                </Form>
                            </CardContent>
                        </Card>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4"/>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
        ;
}
import {FormEvent, useState} from "react";
import {Navbar} from "@/components/ui/navbar.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Terminal} from "lucide-react";
import {userStore} from "@/lib/userStore.ts";
import {Link, useNavigate} from "react-router-dom";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState("");
    const {login, error} = userStore();
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        await login(email, password);
        if (!error) {
            setSuccess("Successfully logged in!");
        }
        navigate("/", {replace: true});
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
                                <form onSubmit={handleLogin}>
                                    <div className="flex flex-col gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="email@soundbest.pl"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password</Label>
                                                <a
                                                    href="#"
                                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                                >
                                                    Forgot your password?
                                                </a>
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="*******"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Button
                                                type="submit"
                                                className="w-full"
                                            >
                                                Login
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center text-sm">
                                        Don't have an account? {" "}
                                        <Link to="/register"
                                              className="underline underline-offset-4">
                                            Sign up
                                        </Link>
                                    </div>
                                </form>
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
            </main>
        </div>
    );
}
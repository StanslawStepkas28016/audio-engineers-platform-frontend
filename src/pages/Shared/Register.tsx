import {axiosInstance} from "@/lib/axios.ts";
import {ChangeEvent, FormEvent, useState} from "react";
import {isAxiosError} from "axios";
import {Navbar} from "@/components/ui/navbar.tsx";
import {useNavigate} from "react-router-dom";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Terminal} from "lucide-react";
import {AppRoles} from "@/shared/app-roles.tsx";

export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    roleName: string;
}

export const Register = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        roleName: AppRoles.Client,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRoleChange = (role: string) => {
        setFormData({...formData, roleName: role});
    };

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await axiosInstance.post("auth/register",
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    password: formData.password,
                    roleName: formData.roleName,
                }
            );
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
            <main className="flex-1 grid lg:grid-cols-2 overflow-hidden">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-xs">
                            <form className="flex flex-col gap-6" onSubmit={handleRegister}>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <h1 className="text-3xl font-bold">Fill in your information</h1>
                                </div>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="email@soundbest.pl"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="firstName">First name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            placeholder="First name"
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lastName">Last name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            placeholder="Last name"
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                     <div className="grid gap-2">
                                        <Label htmlFor="phoneNumber">Phone number</Label>
                                        <Input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="tel"
                                            placeholder="Phone number"
                                            required
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="*******"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <h3 className="font-medium">What do you want to do?</h3>
                                        <RadioGroup
                                            value={formData.roleName}
                                            onValueChange={handleRoleChange}
                                            className="space-y-3"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Audio Engineer" id="engineer"/>
                                                <Label htmlFor="engineer" className="font-normal">
                                                    I am an audio engineer and want to offer my services
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Client" id="client"/>
                                                <Label htmlFor="client" className="font-normal">
                                                    I am a client and want to look for audio engineers
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>


                                    <Button type="submit" className="w-full">
                                        Sign up
                                    </Button>
                                </div>
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
                            </form>
                        </div>
                    </div>
                </div>
                <div className="relative hidden bg-muted lg:block">
                    <img
                        src="src/assets/pexels-photo-164938.jpeg"
                        alt="Image"
                        className="absolute  h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </main>
        </div>
    );
}
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {ChangeEvent, FormEvent, useState} from "react";
import {RegisterFormData} from "@/pages/Register.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from "lucide-react";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";

export type RegisterFormProps = {
    handleMethodDelegate: (e: RegisterFormData) => void;
    error?: string;
    className?: string;
}

export function RegisterForm({
                                 handleMethodDelegate,
                                 error,
                                 className,
                             }: RegisterFormProps) {

    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        roleName: "Client",
    });

    const handleChange = (field: keyof RegisterFormData) => (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({...formData, [field]: e.target.value});
    };

    const handleRoleChange = (role: string) => {
        setFormData({...formData, roleName: role});
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleMethodDelegate(formData);
    };

    return (
        <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-3xl font-bold">Fill in your information</h1>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="email@soundbest.pl"
                        required
                        value={formData.email}
                        onChange={handleChange("email")}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        required
                        value={formData.firstName}
                        onChange={handleChange("firstName")}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        required
                        value={formData.lastName}
                        onChange={handleChange("lastName")}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="text">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="qwerty1234"
                        required
                        value={formData.username}
                        onChange={handleChange("username")}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">Phone number</Label>
                    <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Phone number"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange("phoneNumber")}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="*******"
                        required
                        value={formData.password}
                        onChange={handleChange("password")}
                    />
                </div>
                {/*<div className="flex flex-col items-center gap-10 text-center mt-5 mb-5">*/}
                {/*    <h1 className="text-2xl font-bold">What do you want to do?</h1>*/}
                {/*    <RadioGroup*/}
                {/*        className="gap-10"*/}
                {/*        value={formData.roleName}*/}
                {/*        onValueChange={handleRoleChange}*/}
                {/*    >*/}
                {/*        <div className="flex items-center space-x-2">*/}
                {/*            <RadioGroupItem value="Audio Engineer" id="r2"/>*/}
                {/*            <Label htmlFor="r2" className="align-middle">I am an audio engineer and want to offer my*/}
                {/*                services</Label>*/}
                {/*        </div>*/}
                {/*        <div className="flex items-center space-x-2">*/}
                {/*            <RadioGroupItem value="Client" id="r2"/>*/}
                {/*            <Label htmlFor="r2">I am a client and want to look for audio engineers</Label>*/}
                {/*        </div>*/}
                {/*    </RadioGroup>*/}
                {/*</div>*/}


                <div className="space-y-3 pt-2">
                    <h3 className="font-medium">What do you want to do?</h3>
                    <RadioGroup
                        value={formData.roleName}
                        onValueChange={handleRoleChange}
                        className="space-y-3"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Audio Engineer" id="engineer" />
                            <Label htmlFor="engineer" className="font-normal">
                                I am an audio engineer and want to offer my services
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Client" id="client" />
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
            </div>
        </form>
    )
}

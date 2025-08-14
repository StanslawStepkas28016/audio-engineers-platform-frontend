import {Navbar} from "@/components/ui/navbar.tsx";
import {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle, Terminal} from "lucide-react";

export type VerifyAccountFormData = {
    verificationCode: string;
}

export const VerifyAccountPage = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState<VerifyAccountFormData>({
        verificationCode: "",
    });

    const handleVerifyAccount = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await axiosInstance.post("auth/verify-account",
                {
                    verificationCode: formData.verificationCode,
                }
            );
            setSuccess("Successfully verified!");
            setTimeout(() => navigate("/login"), 1000);
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
            <main className="flex-1 flex w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <form className="flex flex-col gap-6 items-center" onSubmit={handleVerifyAccount}>

                        <div className="hidden lg:flex h-full justify-end items-center overflow-hidden -mt-30 -mb-10">
                            <img
                                src="/src/assets/coding.jpg"
                                alt="decoration"
                                className="object-contain filter dark:invert"
                            />
                        </div>

                        <InputOTP
                            required
                            minLength={6}
                            maxLength={6}
                            value={formData.verificationCode}
                            onChange={
                                (code) =>
                                    setFormData(prev => ({...prev, verificationCode: code}))
                            }
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
                        <h1 className="text-center text-sm text-muted-foreground">Please enter the verification code
                            sent to your
                            e-mail address. This code will expire in 24 hours!</h1>
                        <Button type="submit" className="w-full">
                            Submit
                        </Button>
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
                </div>
            </main>
        </div>
    );
}
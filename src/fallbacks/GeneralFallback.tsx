import {FallbackProps} from 'react-error-boundary'
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

export const GeneralFallback = ({error, resetErrorBoundary}: FallbackProps) => {
    return (
            <div className="p-50 gap-5 md: flex flex-col min-h-screen justify-center">
                <div className="text-center">
                    <h1 className="text-5xl">We are sorry!</h1>
                </div>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Service is experiencing issues. Please read the following message {error.message}
                    </AlertDescription>
                </Alert>
                <Button onClick={resetErrorBoundary}>Try to refresh the page</Button>
            </div>
    );
}
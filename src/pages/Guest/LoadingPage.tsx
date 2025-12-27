import {Loader2Icon} from "lucide-react";

export const LoadingPage = () => {
    return (
        <div className={"flex justify-center items-center h-screen"}>
            <Loader2Icon className="animate-spin h-40 w-40"/>
        </div>
    );
}
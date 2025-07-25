import {Navbar} from "@/components/ui/navbar.tsx";

export const NotFoundPage = () => {
    return (
        <div>
            <Navbar/>
            <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                <div className="w-full space-y-6 text-center">
                    <div className="space-y-3">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl transition-transform hover:scale-110">404</h1>
                        <p className="text-gray-500">Looks like you've ventured into the unknown digital realm.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
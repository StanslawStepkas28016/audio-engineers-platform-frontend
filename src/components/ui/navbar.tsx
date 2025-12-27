import {ThemeToggle} from "@/components/ui/theme-toggle.tsx";
import {AudioWaveform} from "lucide-react";
import {LanguageToggle} from "@/components/ui/language-toggle.tsx";

export const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-4 py-2">
            <a href="/" className="flex items-center gap-2 font-medium">
                <div
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <AudioWaveform className="size-4"/>
                </div>
                soundbest.pl
            </a>
            <div className="flex items-center gap-2">
                <ThemeToggle/>
                <LanguageToggle/>
            </div>
        </nav>
    );
}
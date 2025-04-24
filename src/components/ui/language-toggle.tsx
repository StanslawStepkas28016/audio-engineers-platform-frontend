import {Languages} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const AvailableLanguages = {
    eng: "en-US",
    pol: "pl-PL",
} as const

export function LanguageToggle() {
    // On load
        localStorage.setItem("lang", AvailableLanguages.eng);

    function setLang(lang: string) {
        localStorage.setItem("lang", lang);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Languages/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLang(AvailableLanguages.eng)}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang(AvailableLanguages.pol)}>
                    Polish
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
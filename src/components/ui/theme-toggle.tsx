import {Moon, Sun} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Theme, useTheme} from "@/components/theme-provider"
import {useTranslation} from "react-i18next";

export function ThemeToggle() {
    const {t} = useTranslation();
    const {theme, setTheme} = useTheme();

    return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup value={theme} onValueChange={(e: string) => setTheme(e as Theme)}>
                        <DropdownMenuRadioItem
                                value="light">{t("Common.theme-light")}</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                                value="dark">{t("Common.theme-dark")}</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                                value="system"> {t("Common.theme-system")}</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
    )
}
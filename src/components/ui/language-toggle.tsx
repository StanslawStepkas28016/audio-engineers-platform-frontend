import {Languages} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import i18n, {AvailableLanguages} from "@/lib/i18n/i18n.ts";
import {useTranslation} from "react-i18next";

export function LanguageToggle() {
    const {t} = useTranslation();

    async function setLang(lang: string) {
        localStorage.setItem("lang", lang || AvailableLanguages.pl);
        await i18n.changeLanguage(localStorage.getItem("lang") || AvailableLanguages.pl);
    }

    function getLang() {
        return localStorage.getItem("lang") || AvailableLanguages.pl;
    }

    return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Languages/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup value={getLang()} onValueChange={setLang}>
                        <DropdownMenuRadioItem value={AvailableLanguages.en}>{t("Common.lang-en")}</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value={AvailableLanguages.pl}>{t("Common.lang-pl")}</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
    )
}
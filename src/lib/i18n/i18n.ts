import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import enLang from "./locales/en/en.json";
import plLang from "./locales/pl/pl.json";

export const AvailableLanguages = {
    en: "en-US",
    pl: "pl-PL",
}

const resources = {
    en: {
        translation: enLang
    },
    pl: {
        translation: plLang
    }
}

i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: localStorage.getItem("lang") || AvailableLanguages.pl,
            interpolation: {
                escapeValue: false
            }
        });

export default i18n;
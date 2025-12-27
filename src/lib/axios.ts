import axios from "axios";
import {AvailableLanguages} from "@/lib/i18n/i18n.ts";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API,
    withCredentials: true,
    headers: {
        "Accept-Language": localStorage.getItem("lang") || AvailableLanguages.en,
    },
});
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL_DEV,
    withCredentials: true,
    headers: {
        "Accept-Language": localStorage.getItem("lang") || "en-US",
    },
});
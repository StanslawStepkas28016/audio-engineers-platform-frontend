import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API,
    withCredentials: true,
    headers: {
        "Accept-Language": localStorage.getItem("lang") || "en-US",
    },
});
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND,
    // baseURL: '/api',
    withCredentials: true,
    // headers: {
    //     "Accept-Language": localStorage.getItem("lang") || "en-US",
    // },
});
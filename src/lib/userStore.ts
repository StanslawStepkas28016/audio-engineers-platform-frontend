import {create} from "zustand/react";
import {axiosInstance} from "@/lib/axios.ts";
import {isAxiosError} from "axios";

export type UserAuthState = {
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    error: string;
    userData: {
        idUser: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        roleName: string;
        idRole: string;
    },
    checkAuth: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const userStore = create<UserAuthState>((set) => ({
    isAuthenticated: false,
    isCheckingAuth: true,
    error: "",
    userData: {
        idUser: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        roleName: "",
        idRole: ""
    },

    login: async (email, password) => {
        try {
            const res = await axiosInstance.post("auth/login",
                {
                    email: email,
                    password: password
                }
            );

            set({isAuthenticated: true, userData: res.data, error: ""});
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                const exceptionMessage = e.response.data.ExceptionMessage;
                set({isAuthenticated: false, error: exceptionMessage});
            }
        }
    },

    /*
    * Method used for checking the user authentication status.
    * This API call will return the user associated data if the user is logged in.
    * If the users accessToken is expired the API will return a 401 Unauthorized error,
    * which will be handled by using an interceptor in the axiosInstance.
    * */
    checkAuth: async () => {
        /*
        * This interceptor is used to handle the 401 Unauthorized error when the user has an expired access token.
        * It will try to refresh the token, but if the refresh fails it will make the user logged out.
        * */
        const refreshInterceptor = axiosInstance.interceptors.response.use(function (response) {
            return response;
        }, async function (e) {
            // If the check-auth request fails with a 401 error, refresh the token
            if (e.response.status === 401 && e.config.url !== "auth/refresh-token") {
                // Make sure we don't retry the request if it has already been "retried"
                if (!e.config._retry) {
                    try {
                        // Try refreshing the token
                        await axiosInstance.post("auth/refresh-token");
                    } catch (refreshError) {
                        // If the refresh token request fails, we need to log the user out
                        console.log(refreshError);
                        set({isAuthenticated: false});
                    }
                }
            }

            return await Promise.reject(e);
        });

        // Set the retry flag to prevent infinite loops
        set({isCheckingAuth: true});

        try {
            const resp = await axiosInstance.get("auth/check-auth");
            // console.log(resp.data);
            set({isAuthenticated: true, userData: resp.data});
        } catch (e) {
            set({isAuthenticated: false});
            console.log(e);
        } finally {
            set({isCheckingAuth: false});
        }

        // Eject the response interceptor after performing the refresh token logic
        axiosInstance.interceptors.response.eject(refreshInterceptor);
    },

    /*
    * Method used for logging out the user. The API will send a response with remove
    * the access and refresh tokens from the cookies and the userStore will be updated.
    * */
    logout: async () => {
        try {
            await axiosInstance.post("auth/logout");
            set({isAuthenticated: false, isCheckingAuth: false});
        } catch (e) {
            console.log(e)
            alert("An error occurred while logging out!");
        }
    }
}));




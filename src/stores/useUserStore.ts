import {create} from "zustand/react";
import {axiosInstance} from "@/lib/axios.ts";
import {useChatStore} from "@/stores/useChatStore.ts";

export type UserStore = {
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    isViewingOwnAdvert: boolean;
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
    setIsViewingOwnAdvert: (state: boolean) => Promise<void>;
}

const emptyUser = {
    idUser: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    roleName: "",
    idRole: ""
}

export const useUserStore = create<UserStore>()((set) => ({
    isAuthenticated: false,
    isCheckingAuth: true,
    isViewingOwnAdvert: false,
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

    /*
    * Method used for logging in the user, the API will send a response with an access token, as well as a refresh token
    * in a cookie.
    * */
    login: async (email, password) => {
        await axiosInstance.post("auth/login",
                {
                    email: email,
                    password: password
                })
                .then(r =>
                        set({
                            isAuthenticated: true,
                            userData: r.data,
                            error: ""
                        })
                )
                .catch(e =>
                        set({
                            isAuthenticated: false,
                            error: e.response.data.ExceptionMessage || "Error while logging in.",
                            userData: emptyUser
                        })
                );
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
        }, async function (error) {
            // Get the original request that caused the error.
            const originalRequest = error.config;
            // If the check-auth request fails with a 401 error, refresh the token.
            if (error.response.status===401 && error.config.url!=="auth/refresh-token") {
                // Make sure we don't retry the request if it has already been "retried".
                if (!error.config._retry) {
                    try {
                        // Try refreshing the token.
                        await axiosInstance.post("auth/refresh-token");
                        return axiosInstance(originalRequest);
                    } catch (refreshError) {
                        // If the refresh token request fails, we need to log the user out.
                        console.log(refreshError);
                        set({
                            isAuthenticated: false,
                            userData: emptyUser
                        });
                    }
                }
            }

            return await Promise.reject(error);
        });

        // Set the retry flag to prevent infinite loops.
        set({isCheckingAuth: true});

        try {
            const resp = await axiosInstance.get("auth/check-auth");
            set({
                isAuthenticated: true,
                userData: resp.data
            });
        } catch (e) {
            console.log(e);
            set({
                isAuthenticated: false,
                userData: emptyUser
            });
        } finally {
            set({
                isCheckingAuth: false
            });
        }

        // Eject the response interceptor after performing the refresh token logic.
        axiosInstance.interceptors.response.eject(refreshInterceptor);
    },

    /*
    * Method used for logging out the user. The API will send a response with remove
    * the access and refresh tokens from the cookies and the userStore will be updated.
    * */
    logout: async () => {
        await axiosInstance
                .post("auth/logout")
                .then(async () => {
                    await useChatStore.getState().stopHubConnection();
                    set({
                        isAuthenticated: false,
                        isCheckingAuth: false,
                        userData: emptyUser
                    });
                })
                .catch(() => alert("An error occurred while logging out!"));
    },

    setIsViewingOwnAdvert: async (state) => {
        set({
            isViewingOwnAdvert: state
        })
    }
}));
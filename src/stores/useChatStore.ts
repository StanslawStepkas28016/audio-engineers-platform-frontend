import {axiosInstance} from "@/lib/axios";
import {signalrConnection} from "@/lib/signalr";
import {create} from "zustand/react";
import {useUserStore} from "@/stores/useUserStore.ts";
import axios, {isAxiosError} from "axios";
import toast from "react-hot-toast";
import {devtools} from 'zustand/middleware'
import {MessageT, UserChatData} from "@/types/types.ts";

export type UseChatStore = {
    totalCount: number,
    isInChatView: boolean,
    isLoadingChatData: boolean,
    isOnline: boolean,
    interactedUsersData: UserChatData[]
    selectedUserData: UserChatData,
    messages: MessageT[],
    error: string,
    getInteractedUsersData: () => Promise<void>,
    getSelectedUserData: (idUser: string) => Promise<void>,
    clearSelectedUserData: () => Promise<void>,
    getMessages: (idUserRecipient: string, page: number, pageSize: number) => Promise<void>,
    startHubConnection: () => Promise<void>,
    stopHubConnection: () => Promise<void>,
    subscribeToMessages: () => Promise<void>,
    unsubscribeFromMessages: () => Promise<void>,
    sendTextMessage: (idUserRecipient: string, textContent: string) => Promise<void>,
    sendFileMessage: (idUserRecipient: string, files: File) => Promise<void>,
};

export const useChatStore = create<UseChatStore>()(devtools((set, get) => ({
    totalCount: 0,
    isInChatView: false,
    isLoadingChatData: true,
    isOnline: false,
    interactedUsersData: [],
    selectedUserData: {
        idUser: "",
        firstName: "",
        lastName: "",
    },
    messages: [],
    error: "",

    getInteractedUsersData: async () => {
        set({
            interactedUsersData: await axiosInstance
                    .get(`chat/${useUserStore.getState().userData.idUser}/interacted`).then(r => r.data.interactedUsersList),
            isLoadingChatData: false,
        })
    },

    getSelectedUserData: async (idUser) => {
        set({
            selectedUserData: await axiosInstance.get(`chat/${idUser}/user-data`).then(r => r.data).catch(e => console.log(e)),
            isLoadingChatData: false,
            isInChatView: true,
        })
    },

    clearSelectedUserData: async () => {
        set({
            messages: [],
            selectedUserData: {
                idUser: "",
                firstName: "",
                lastName: "",
                unreadCount: 0
            },
            isInChatView: false,
        })
    },

    getMessages: async (idUserRecipient, page, pageSize) => {
        const newMessages = await axiosInstance.get(
                `chat/${useUserStore.getState().userData.idUser}/${idUserRecipient}`, {
                    params: {
                        page: page,
                        pageSize: pageSize
                    }
                }).then(r => r.data).catch(e => set({error: e}));

        set({
            totalCount: newMessages.totalCount ?? 0
        })

        set({
            messages: page===1 ? newMessages.items:[...newMessages.items, ...get().messages],
            isOnline: await axiosInstance.get(`chat/${idUserRecipient}/status`).then(r => r.data.isOnline).catch(e => set({error: e})),
            isLoadingChatData: false,
            isInChatView: true
        })
    },

    startHubConnection: async () => {
        // Ensure user is authenticated, this method is supposed to be called
        // from the checkAuth method (only if the check is positive).
        if (!useUserStore.getState().isAuthenticated) return;

        // Start a connection.
        await signalrConnection.start()
                .catch(err => {
                    console.error(err)
                });
    },

    stopHubConnection: async () => {
        await signalrConnection.stop();
    },

    subscribeToMessages: async () => {
        // Listening for availability status messages.
        signalrConnection.on("ReceiveIsOnlineMessage", (message) => {
            // Only set the status if the user is equal to the selected user.
            if (get().selectedUserData.idUser!==message.idUser) return;

            set({
                isOnline: message.isOnline,
            })
        })

        // Listening for normal chat messages.
        signalrConnection.on("ReceiveMessageFromSender", (message: MessageT) => {
            if (!get().isInChatView) {
                toast.success(`New message from ${message.senderFirstName} ${message.senderLastName}.`, {
                    icon: '❗️',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });

                get().getInteractedUsersData();

                return;
            }

            // Only add a message if it comes from the currently selected user.
            if (get().selectedUserData.idUser!==message.idUserSender) return;

            const msg: MessageT = {
                idMessage: message.idMessage,
                idUserSender: message.idUserSender,
                senderFirstName: message.senderFirstName,
                senderLastName: message.senderLastName,
                isRead: message.isRead,
                textContent: message.textContent,
                fileName: message.fileName,
                fileUrl: message.fileUrl,
                dateSent: message.dateSent
            };
            set({
                messages: [...get().messages, msg],
                isOnline: true // Getting a message from a user means that the sender is online, hence this state is being set to Online.
            });
        });
    },

    unsubscribeFromMessages: async () => {
        signalrConnection.off("ReceiveMessageFromSender");
        signalrConnection.off("ReceiveIsOnlineMessage");
    },

    sendTextMessage: async (idUserRecipient, textContent) => {
        // Message is being sent to the server as an HTTP request and the server
        // broadcasts that message using websockets to the selected idUserRecipients active connections.
        let res = null;
        try {
            res = await axiosInstance.post(`chat/text-message`, {
                idUserSender: useUserStore.getState().userData.idUser,
                idUserRecipient: idUserRecipient,
                textContent: textContent
            });
        } catch (e) {
            if (isAxiosError(e)) {
                set({error: e.response?.data.ExceptionMessage})
                alert(get().error);
            }
            return;
        }

        // When sending first message add to sidebars list and prevent null values on conversation loading.
        if (!(get().messages).length) {
            await get().getInteractedUsersData();
        }

        set({
            messages: [...get().messages ?? [], res.data]
        })
    },

    sendFileMessage: async (idUserRecipient, file) => {
        // Obtain a presigned URL for uploading on the client side.
        let getPreSignedUrlRes;
        try {
            getPreSignedUrlRes = await axiosInstance.get(`chat/presigned-url-for-upload`, {
                params: {folder: "files", fileName: encodeURIComponent(file.name)}
            });
        } catch (e) {
            if (isAxiosError(e)) {
                set({error: e.response?.data.ExceptionMessage})
                alert(get().error);
            }
            return;
        }

        const preSignedUrl = getPreSignedUrlRes.data.preSignedUrlForUpload;
        const fileKey = getPreSignedUrlRes.data.fileKey

        // Upload a file to S3 and obtains its Key and URL.
        try {
            await axios.put(preSignedUrl, file, {
                headers: {
                    'x-amz-meta-file-name': `${encodeURIComponent(file.name)}`
                }
            });
        } catch (e) {
            if (isAxiosError(e)) {
                set({error: e.response?.data})
                alert(e);
            }
            return;
        }

        // Persist the file related data in the API.
        let fileMessageRes;
        try {
            fileMessageRes = await axiosInstance.post(`chat/file-message`, {
                idUserSender: useUserStore.getState().userData.idUser,
                idUserRecipient: idUserRecipient,
                fileName: file.name,
                fileKey: fileKey,
            });
        } catch (e) {
            if (isAxiosError(e)) {
                set({error: e.response?.data.ExceptionMessage})
                alert(get().error);
            }
            return;
        }

        set({
            messages: [...get().messages ?? [], fileMessageRes.data]
        })
    }
})));


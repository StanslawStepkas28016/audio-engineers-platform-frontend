import {axiosInstance} from "@/lib/axios";
import {signalrConnection} from "@/lib/signalr";
import {create} from "zustand/react";
import {useUserStore} from "@/stores/useUserStore.ts";
import {queryClient} from "@/lib/react-query.ts";

export enum AvailabilityStatus {
    Online = "Online",
    Offline = "Offline"
}

export type Message = {
    idMessage: string,
    idUserSender: string,
    textContent: string,
    fileUrl: string,
    dateSent: string,
}

export type UseChatStore = {
    isLoadingChatData: boolean,
    availabilityStatus: AvailabilityStatus,
    selectedUserData: {
        idUser: string,
        firstName: string,
        lastName: string,
    },
    messages: Message[],
    getSelectedUserData: (idUser: string) => Promise<void>,
    clearSelectedUserData: () => Promise<void>,
    getMessages: (idUserRecipient: string) => Promise<void>,
    subscribeToMessages: () => Promise<void>,
    unsubscribeFromMessages: () => Promise<void>,
    sendTextMessage: (idUserRecipient: string, textContent: string) => Promise<void>,
};

export const useChatStore = create<UseChatStore>((set, get) => ({
    isLoadingChatData: true,
    availabilityStatus: AvailabilityStatus.Offline,
    selectedUserData: {
        idUser: "",
        firstName: "",
        lastName: "",
    },
    messages: [],

    getSelectedUserData: async (idUser) => {
        set({
            selectedUserData: await axiosInstance.get(`/message/${idUser}/user-data`).then(r => r.data).catch(e => console.log(e)),
            isLoadingChatData: false,
        })
    },

    clearSelectedUserData: async () => {
        set({
            selectedUserData: {
                idUser: "",
                firstName: "",
                lastName: ""
            },
        })
    },

    getMessages: async (idUserRecipient) => {
        set({
            messages: await axiosInstance.get(`message/${useUserStore.getState().userData.idUser}/${idUserRecipient}`).then(r => r.data).catch(e => console.log(e)),
            isLoadingChatData: false
        })
    },

    subscribeToMessages: async () => {
        // Listening for availability status messages.
        signalrConnection.on("ReceiveAvailabilityStatusMessage", (message) => {
            set({
                availabilityStatus: message,
            })
        })

        // Listening for normal chat messages.
        signalrConnection.on("ReceiveMessageFromSender", (message: Message) => {
            const msg: Message = {
                idMessage: message.idMessage,
                idUserSender: message.idUserSender,
                textContent: message.textContent,
                fileUrl: message.fileUrl,
                dateSent: message.dateSent,
            };
            set({
                messages: [...get().messages, msg],
                availabilityStatus: AvailabilityStatus.Online // Getting a message from a user means that the sender is online, hence this state is being set to Online.
            });
        });
    },

    unsubscribeFromMessages: async () => {
        signalrConnection.off("ReceiveMessageFromSender");
        signalrConnection.off("ReceiveAvailabilityStatusMessage");
    },

    sendTextMessage: async (idUserRecipient, textContent) => {
        const message: Message = {
            idMessage: "",
            idUserSender: useUserStore.getState().userData.idUser,
            textContent: textContent,
            fileUrl: "",
            dateSent: "",
        }

        // Message is being sent to the server as an HTTP request and the server
        // broadcasts that message using websockets to the selected idUserRecipients active connections.
        const res = await axiosInstance.post(`message`, {
            idUserSender: message.idUserSender,
            idUserRecipient: idUserRecipient,
            textContent: textContent
        });

        // When sending first message add to sidebars list and prevent null values on conversation loading.
        if (!(get().messages).length) {
            await queryClient.invalidateQueries({
                queryKey: ['checkMessagedUsers'],
            });
        }

        set({
            messages: [...get().messages ?? [], res.data]
        })
    }
}));


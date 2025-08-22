import {Button} from "@/components/ui/button";
import {
    PromptInput,
    PromptInputAction,
    PromptInputActions,
    PromptInputTextarea
} from "@/components/ui/prompt-input.tsx";
import {ArrowUp, Paperclip, X} from "lucide-react";
import React, {useEffect, useRef, useState} from "react";
import {Message, MessageContent} from "@/components/ui/message.tsx";
import {ChatContainerContent, ChatContainerRoot} from "@/components/ui/chat-container";
import {useParams} from "react-router-dom";
import {useUserStore} from "@/stores/useUserStore.ts";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {useChatStore} from "@/stores/useChatStore";


export const Chat = () => {
    const [input, setInput] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const uploadInputRef = useRef<HTMLInputElement>(null);

    const {idUserRecipient} = useParams<{ idUserRecipient: string }>();
    const {userData} = useUserStore();
    const {
        getSelectedUserData,
        getMessages,
        sendTextMessage,
        isLoadingChatData,
        messages,
        subscribeToMessages,
        unsubscribeFromMessages,
        clearSelectedUserData
    } = useChatStore();

    useEffect(() => {
        getSelectedUserData(idUserRecipient || "");
        getMessages(idUserRecipient || "");
        subscribeToMessages();

        return () => {
            unsubscribeFromMessages();
            clearSelectedUserData();
        };
    }, [idUserRecipient]);

    const handleSubmit = async () => {
        await sendTextMessage(idUserRecipient || "", input);
        setInput("");
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    }

    const handleRemoveFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
        if (uploadInputRef?.current) {
            uploadInputRef.current.value = "";
        }
    }

    if (isLoadingChatData) {
        return <LoadingPage/>;
    }

    return (
        <div>
            <div className="p-20 md: flex h-[400px] w-full flex-col min-h-screen">
                <ChatContainerRoot className="flex-1">
                    <ChatContainerContent className="space-y-4 p-4">
                        {
                            messages?.map((message) => (
                                <div key={message.idMessage}>
                                    <Message className={
                                        message.idUserSender === userData.idUser ? "justify-end" : "justify-start"
                                    }>
                                        <MessageContent
                                            className={
                                                message.idUserSender === userData.idUser ? "" : "invert"
                                            }
                                        >
                                            {message.textContent}
                                        </MessageContent>
                                    </Message>
                                </div>
                            ))
                        }
                    </ChatContainerContent>
                </ChatContainerRoot>

                <PromptInput
                    value={input}
                    onValueChange={setInput}
                    onSubmit={handleSubmit}
                    className="static"
                >
                    {files.length > 0 && (
                        <div className="flex flex-wrap gap-2 pb-2">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <Paperclip className="size-4"/>
                                    <span className="max-w-[120px] truncate">{file.name}</span>
                                    <Button
                                        onClick={() => handleRemoveFile(index)}
                                        className="hover:bg-secondary/50 rounded-full p-1"
                                    >
                                        <X className="size-4"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    <PromptInputTextarea placeholder="Send a message..."/>

                    <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
                        <PromptInputAction tooltip="Attach files">
                            <label
                                htmlFor="file-upload"
                                className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
                            >
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <Paperclip className="text-primary size-5"/>
                            </label>
                        </PromptInputAction>

                        <PromptInputAction
                            tooltip={"Send message"}
                        >
                            <Button
                                variant="default"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={handleSubmit}
                            >
                                <ArrowUp className="size-5"/>
                            </Button>
                        </PromptInputAction>
                    </PromptInputActions>
                </PromptInput>
            </div>
        </div>
    )
}
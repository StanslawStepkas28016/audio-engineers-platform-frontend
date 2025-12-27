import {Button} from "@/components/ui/button";
import {
    PromptInput,
    PromptInputAction,
    PromptInputActions,
    PromptInputTextarea
} from "@/components/ui/prompt-input.tsx";
import {ArrowUp, Download, Paperclip, X} from "lucide-react";
import React, {useEffect, useState} from "react";
import {Message, MessageContent} from "@/components/ui/message.tsx";
import {ChatContainerContent, ChatContainerRoot} from "@/components/ui/chat-container";
import {useParams} from "react-router-dom";
import {useUserStore} from "@/stores/useUserStore.ts";
import {LoadingPage} from "@/pages/Guest/LoadingPage.tsx";
import {useChatStore} from "@/stores/useChatStore";
import {MessageT} from "@/types/types.ts";
import {useTranslation} from "react-i18next";
import {Item, ItemContent, ItemMedia, ItemTitle} from "@/components/ui/item.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";

export const Chat = () => {
    const {t} = useTranslation();

    const [input, setInput] = useState("");
    const [file, setFile] = useState<File | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [showMessageDialog, setShowMessageDialog] = useState(false);
    const pageSize = 10;

    const {idUserRecipient} = useParams<{ idUserRecipient: string }>();
    const {userData} = useUserStore();
    const {
        getSelectedUserData,
        getMessages,
        sendTextMessage,
        sendFileMessage,
        isLoadingChatData,
        isSendingFileMessage,
        messages,
        clearSelectedUserData,
        totalCount
    } = useChatStore();

    useEffect(() => {
        getSelectedUserData(idUserRecipient || "");
        getMessages(idUserRecipient || "", page, pageSize);

        return () => {
            clearSelectedUserData();
        };
    }, [idUserRecipient]);

    useEffect(() => {
        getMessages(idUserRecipient || "", page, pageSize);
    }, [page]);

    // Remove scrolling from browser.
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "scroll"
        };
    });

    const handleLoadMoreMessages = async () => {
        setPage(page => page + 1)
    }

    const handleSubmit = async () => {
        if (!input && !file) {
            setShowMessageDialog(true);
            return;
        } else if (input && !file) {
            await sendTextMessage(idUserRecipient || "", input);
            setInput("");
        } else if (!input && file) {
            await sendFileMessage(idUserRecipient || "", file);
            setFile(undefined);
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = event.target.files;
            setFile(newFiles[0]);
        }
    }

    const handleRemoveFile = () => {
        setFile(undefined);
    }

    if (isLoadingChatData) {
        return <LoadingPage/>;
    }

    return (
            <div>
                <div className="p-20 md: flex h-[400px] w-full flex-col min-h-screen">
                    {isSendingFileMessage ? (
                            <div className="flex justify-center align-middle">
                                <Item variant="muted">
                                    <ItemMedia>
                                        <Spinner/>
                                    </ItemMedia>
                                    <ItemContent>
                                        <ItemTitle
                                                className="line-clamp-1">{t("Shared.Chat.wait-for-upload")}</ItemTitle>
                                    </ItemContent>
                                </Item>
                            </div>
                    ):(
                            <>
                                <ChatContainerRoot className="flex-1">
                                    <ChatContainerContent className="space-y-4 p-4">
                                        {
                                                totalCount > messages.length &&
                                                (<Button variant="outline" onClick={handleLoadMoreMessages}>
                                                    {t("Shared.Chat.get-older-messages")}
                                                </Button>)
                                        }

                                        {
                                            messages?.map((message: MessageT) => (
                                                    <div key={message.idMessage}>
                                                        <Message className={
                                                            message.idUserSender===userData.idUser ? "justify-end":"justify-start invert"
                                                        }>
                                                            {
                                                                message.textContent ? (
                                                                        <MessageContent>
                                                                            {message.textContent}
                                                                        </MessageContent>
                                                                ):(
                                                                        <Button className="p-10" variant="secondary">
                                                                            <a href={message.fileUrl} download>
                                                                                <Download/> {message.fileName}
                                                                            </a>
                                                                        </Button>
                                                                )
                                                            }
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
                                        className="mb-5"
                                >
                                    {
                                            file &&
                                        <div className="flex flex-wrap gap-2 pb-2">
                                            <div
                                                className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <Paperclip className="size-4"/>
                                                <span className="max-w-[120px] truncate">{file.name}</span>
                                                <Button
                                                    onClick={handleRemoveFile}
                                                    className="hover:bg-secondary/50 rounded-full p-1"
                                                >
                                                    <X className="size-4"/>
                                                </Button>
                                            </div>
                                        </div>
                                    }

                                    {
                                            !file && (
                                                    <PromptInputTextarea placeholder={t("Shared.Chat.send-a-message")}/>)
                                    }

                                    <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
                                        <PromptInputAction tooltip={t("Shared.Chat.attach-files")}>
                                            <label
                                                    htmlFor="file-upload"
                                                    className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
                                            >
                                                <input
                                                        type="file"
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

                                <AlertDialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>{t("Shared.Chat.error-no-data-provided-title")}</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {t("Shared.Chat.error-no-data-provided-description")}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogAction>
                                                {t("Common.close")}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                    )}


                </div>
            </div>
    )
}
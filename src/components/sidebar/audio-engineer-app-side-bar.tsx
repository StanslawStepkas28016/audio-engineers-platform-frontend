import * as React from "react"
import {BookOpen, MessageCircleDashed, Settings} from "lucide-react"

import {SidebarContentMapper} from "@/components/sidebar/sidebar-content-mapper.tsx"
import {FooterNavLoggedUser} from "@/components/sidebar/footer-nav-logged-user.tsx"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar.tsx"
import {Navbar} from "@/components/ui/navbar.tsx";
import {useChatStore} from "@/stores/useChatStore.ts";
import {useUserStore} from "@/stores/useUserStore.ts";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";

export function AudioEngineerAppSideBar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {t} = useTranslation();

    const {getInteractedUsersData, interactedUsersList, isLoadingChatData} = useChatStore();
    const {userData} = useUserStore();

    const [showMessageDialog, setShowMessageDialog] = useState(false);

    useEffect(() => {
        getInteractedUsersData();
    }, []);


    if (isLoadingChatData) {
        return;
    }

    const data = {
        user: {
            name: userData.firstName + " " + userData.lastName,
            email: userData.email
        },
        options: [
            {
                labelTitle: t("Sidebar.AudioEngineer.see-and-manage-advert-label"),
                title: t("Sidebar.Shared.adverts-title"),
                url: "#",
                icon: BookOpen,
                isActive: true,
                items: [
                    {
                        title: t("Sidebar.Shared.see-all-adverts-label"),
                        url: "/",
                    },
                    {
                        title: t("Sidebar.AudioEngineer.see-your-advert-label"),
                        url: "/my-advert",
                    },
                    {
                        title: t("Sidebar.AudioEngineer.add-your-advert-label"),
                        url: "/add-advert",
                    },
                    {
                        title: t("Sidebar.AudioEngineer.edit-your-advert-label"),
                        url: "/edit-advert",
                    },
                    {
                        title: t("Sidebar.AudioEngineer.delete-your-advert-label"),
                        url: "/delete-advert",
                    },
                ],
            },
            {
                labelTitle: t("Sidebar.AudioEngineer.message-your-clients-label"),
                title: t("Sidebar.Shared.messages"),
                url: "#",
                icon: MessageCircleDashed,
                isActive: true,
                items: interactedUsersList?.length > 0 ? interactedUsersList.map((messagedUser) => ({
                    title: `${messagedUser.firstName} ${messagedUser.lastName} ${messagedUser.unreadCount===0 ? '':`(${messagedUser.unreadCount})`}`,
                    url: `/chat/${messagedUser.idUser}`,
                })):[
                    {
                        title: t("Sidebar.AudioEngineer.where-are-messages"),
                        url: "#",
                        onClick: () => setShowMessageDialog(true),
                    }
                ],
            },
            {
                labelTitle: t("Sidebar.Shared.manage-your-account-label"),
                title: t("Sidebar.Shared.manage-your-account-title"),
                url: "#",
                icon: Settings,
                isActive: true,
                items: [
                    {
                        title: t("Sidebar.Shared.manage-your-account-items-reset-password"),
                        url: "/reset-password",
                    },
                    {
                        title: t("Sidebar.Shared.manage-your-account-items-reset-email"),
                        url: "/reset-email",
                    },
                    {
                        title: t("Sidebar.Shared.manage-your-account-items-reset-phone-number"),
                        url: "/reset-phone-number",
                    }
                ],
            },
        ],
    }

    return (
            <>
                <Sidebar collapsible="offcanvas" {...props}>
                    <SidebarHeader>
                        <Navbar/>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarContentMapper items={data.options}/>
                    </SidebarContent>
                    <SidebarFooter>
                        <FooterNavLoggedUser user={data.user}/>
                    </SidebarFooter>
                </Sidebar>

                <AlertDialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t("Sidebar.AudioEngineer.where-are-messages")}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t("Sidebar.AudioEngineer.where-are-messages-description")}
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
    )
}

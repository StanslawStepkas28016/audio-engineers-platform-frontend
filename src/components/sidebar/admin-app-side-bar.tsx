import * as React from "react"
import {BookOpen, Settings, Search, MessageCircleDashed} from "lucide-react"

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

export function AdminAppSideBar({...props}: React.ComponentProps<typeof Sidebar>) {
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
                labelTitle: t("Sidebar.Shared.see-engineers-adverts-label-title"),
                title: t("Sidebar.Shared.adverts-title"),
                url: "#",
                icon: BookOpen,
                isActive: true,
                items: [
                    {
                        title: t("Sidebar.Shared.see-all-adverts-label"),
                        url: "/",
                    }
                ],
            },
            {
                labelTitle: (t("Sidebar.Admin.message-engineers")),
                title: (t("Sidebar.Shared.messages")),
                url: "#",
                icon: MessageCircleDashed,
                isActive: true,
                items: interactedUsersList?.length > 0 ? interactedUsersList.map((messagedUser) => ({
                    title: `${messagedUser.firstName} ${messagedUser.lastName} ${messagedUser.unreadCount===0 ? '':`(${messagedUser.unreadCount})`}`,
                    url: `/chat/${messagedUser.idUser}`,
                })):[
                    {
                        title: t("Sidebar.Client.want-to-message"),
                        url: "#",
                        onClick: () => setShowMessageDialog(true),
                    }
                ],
            },
            {
                labelTitle: (t("Sidebar.Admin.admin-management-title")),
                title: (t("Sidebar.Admin.data-management-label")),
                url: "#",
                icon: Search,
                isActive: true,
                items: [
                    {
                        title: (t("Sidebar.Admin.advert-data-label")),
                        url: "/advert-data",
                    },
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
                            <AlertDialogTitle>{t("Sidebar.Client.want-to-message-title")}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t("Sidebar.Client.want-to-message-description")}
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

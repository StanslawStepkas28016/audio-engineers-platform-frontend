import * as React from "react"
import {BookOpen, Settings, Search} from "lucide-react"

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
import {useEffect} from "react";
import {useTranslation} from "react-i18next";

export function AdminAppSideBar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {t} = useTranslation();

    const {getInteractedUsersData, /*interactedUsersData,*/ isLoadingChatData} = useChatStore();
    const {userData} = useUserStore();

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
                labelTitle: (t("Sidebar.Admin.admin-management-title")),
                title: (t("Sidebar.Admin.data-management-label")),
                url: "#",
                icon: Search,
                isActive: true,
                items: [
                    {
                        title: (t("Sidebar.Admin.user-data-label")),
                        url: "/user-data",
                    },
                    {
                        title: (t("Sidebar.Admin.advert-data-label")),
                        url: "/advert-data",
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
    )
}

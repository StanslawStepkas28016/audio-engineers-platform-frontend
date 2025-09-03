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
import {useEffect} from "react";

export function AudioEngineerAppSideBar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {getInteractedUsersData, interactedUsersData, isLoadingChatData} = useChatStore();
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
                labelTitle: "See and manage your adverts",
                title: "Adverts",
                url: "#",
                icon: BookOpen,
                isActive: true,
                items: [
                    {
                        title: "See all adverts",
                        url: "/",
                    },
                    {
                        title: "See your advert",
                        url: "/my-advert",
                    },
                    {
                        title: "Add your advert",
                        url: "/add-advert",
                    },
                    {
                        title: "Edit your advert",
                        url: "/edit-advert",
                    },
                    {
                        title: "Delete your advert",
                        url: "/delete-advert",
                    },
                ],
            },
            {
                labelTitle: "Message your client",
                title: "Messages",
                url: "#",
                icon: MessageCircleDashed,
                isActive: true,
                items: interactedUsersData?.map((messagedUser) => ({
                    title: `${messagedUser.firstName} ${messagedUser.lastName}`,
                    url: `/chat/${messagedUser.idUser}`,
                })) ?? [],
            },
            {
                labelTitle: "Manage your account",
                title: "Account settings",
                url: "#",
                icon: Settings,
                isActive: true,
                items: [
                    {
                        title: "Reset your password",
                        url: "/reset-password",
                    },
                    {
                        title: "Reset your email",
                        url: "/reset-email",
                    },
                    {
                        title: "Reset your phone number",
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

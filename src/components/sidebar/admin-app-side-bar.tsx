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

export function AdminAppSideBar({...props}: React.ComponentProps<typeof Sidebar>) {
    // TODO:
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
                labelTitle: "See engineers adverts",
                title: "Adverts",
                url: "#",
                icon: BookOpen,
                isActive: true,
                items: [
                    {
                        title: "See all adverts",
                        url: "/",
                    }
                ],
            },
            {
                labelTitle: "Admin management",
                title: "Dashboard",
                url: "#",
                icon: Search,
                isActive: true,
                items: [
                    {
                        title: "Manage data",
                        url: "/dashboard",
                    }
                ],
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

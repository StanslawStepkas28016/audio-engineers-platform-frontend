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
import {userStore} from "@/lib/userStore.ts";

export function AudioEngineerAppSideBar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {userData} = userStore();

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
                labelTitle: "Message your clients",
                title: "Messages",
                url: "#",
                icon: MessageCircleDashed,
                isActive: true,
                // TODO: To be fetched from the server
                items: [
                    {
                        title: "Jan Kowalski",
                        url: "#",
                    },
                    {
                        title: "Anna Niewiadomska",
                        url: "#",
                    },
                    {
                        title: "John Doe",
                        url: "#",
                    },
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
                        title: "Change your data",
                        url: "/change-data",
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
                {/* For all users, displayed data only based on the provided items */}
                <SidebarContentMapper items={data.options}/>
            </SidebarContent>
            <SidebarFooter>
                <FooterNavLoggedUser user={data.user}/>
            </SidebarFooter>
        </Sidebar>
    )
}

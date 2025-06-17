import * as React from "react"
import {BookOpen, MessageCircleDashed} from "lucide-react"

import {EngineersSidebarContent} from "@/components/engineers-sidebar-content.tsx"
import {FooterNavLoggedUser} from "@/components/footer-nav-logged-user.tsx"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
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
                title: "Adverts",
                url: "#",
                icon: BookOpen,
                isActive: true,
                items: [
                    {
                        title: "See all adverts",
                        url: "#",
                    },
                    {
                        title: "Add your advert",
                        url: "/add-advert",
                    },
                    {
                        title: "Edit your advert",
                        url: "#",
                    },
                    {
                        title: "Delete your advert",
                        url: "#",
                    },
                ],
            },
            {
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
        ],
    }

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <Navbar/>
            </SidebarHeader>
            <SidebarContent>
                <EngineersSidebarContent items={data.options}/>
            </SidebarContent>
            <SidebarFooter>
                <FooterNavLoggedUser user={data.user}/>
            </SidebarFooter>
        </Sidebar>
    )
}

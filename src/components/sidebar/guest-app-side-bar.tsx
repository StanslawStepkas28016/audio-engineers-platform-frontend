import * as React from "react"
import {BookOpen, Settings} from "lucide-react"

import {SidebarContentMapper} from "@/components/sidebar/sidebar-content-mapper.tsx"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar.tsx"
import {Navbar} from "@/components/ui/navbar.tsx";
import {FooterNavGuestUser} from "@/components/sidebar/footer-nav-guest-user.tsx";

export function GuestAppSideBar({...props}: React.ComponentProps<typeof Sidebar>) {
    const data = {
        user: {
            name: "Guest User",
            email: "guest@soundbest.pl"
        },
        options: [
            {
                labelTitle: "Adverts",
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
                labelTitle: "Explore the platform",
                title: "Account",
                url: "#",
                icon: Settings,
                isActive: true,
                items: [
                    {
                        title: "Login",
                        url: "/login",
                    },
                    {
                        title: "Register",
                        url: "/register",
                    },
                    {
                        // TODO: Implement forgot password functionality
                        title: "Forgot password?",
                        url: "/forgot-password",
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
                <FooterNavGuestUser user={data.user}/>
            </SidebarFooter>
        </Sidebar>
    )
}

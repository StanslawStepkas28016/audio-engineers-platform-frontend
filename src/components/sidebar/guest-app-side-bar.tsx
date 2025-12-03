import * as React from "react"
import {BookAudio, BookOpen, Settings} from "lucide-react"

import {SidebarContentMapper} from "@/components/sidebar/sidebar-content-mapper.tsx"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar.tsx"
import {Navbar} from "@/components/ui/navbar.tsx";
import {FooterNavGuestUser} from "@/components/sidebar/footer-nav-guest-user.tsx";
import {useTranslation} from "react-i18next";

export function GuestAppSideBar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {t} = useTranslation();

    const data = {
        user: {
            name: t("Sidebar.Guest.guest-user-label"),
            email: "guest@soundbest.pl"
        },
        options: [
            {
                labelTitle: t("Sidebar.Shared.guide-label"),
                title: t("Sidebar.Shared.guide-title"),
                url: "#",
                icon: BookAudio,
                isActive: true,
                items: [
                    {
                        title: t("Sidebar.Shared.see-guide-label"),
                        url: "/see-guide",
                    }
                ],
            },
            {
                labelTitle: t("Sidebar.Guest.see-all-adverts-explore-title"),
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
                labelTitle: t("Sidebar.Guest.get-started-title"),
                title: t("Sidebar.Guest.get-started-account-title"),
                url: "#",
                icon: Settings,
                isActive: true,
                items: [
                    {
                        title: t("Sidebar.Guest.get-started-login-label"),
                        url: "/login",
                    },
                    {
                        title: t("Sidebar.Guest.get-started-register-label"),
                        url: "/register",
                    },
                    {
                        title: t("Sidebar.Guest.get-started-forgot-password-label"),
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

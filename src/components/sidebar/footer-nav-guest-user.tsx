import {
    IconDotsVertical, IconHelpCircle,
} from "@tabler/icons-react"

import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar.tsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar.tsx"
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

export function FooterNavGuestUser({
                                       user,
                                   }: {
    user: {
        name: string
        email: string
    }
}) {
    const {isMobile} = useSidebar()
    const navigate = useNavigate();

    const {t} = useTranslation();

    return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Avatar className="h-8 w-8 rounded-lg grayscale">
                                    <AvatarFallback className="rounded-lg">G</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
                                </div>
                                <IconDotsVertical className="ml-auto size-4"/>
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                side={isMobile ? "bottom":"right"}
                                align="end"
                                sideOffset={4}
                        >
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => navigate("see-guide")}>
                                    <IconHelpCircle/>
                                    {t("Footer.need-help-label")}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
    )
}

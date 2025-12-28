"use client"

import {ChevronRight, type LucideIcon} from "lucide-react"
import {Link, useLocation} from "react-router-dom"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx"
import {useUserStore} from "@/stores/useUserStore.ts";

export function SidebarContentMapper({
                                         items,
                                     }: {
    items: {
        labelTitle: string
        title: string
        url: string
        icon?: LucideIcon
        items?: {
            title: string
            url: string
            onClick?: () => void
        }[]
    }[]
}) {
    const {pathname} = useLocation();
    const {isViewingOwnAdvert} = useUserStore();

    return (
            <SidebarGroup>
                <SidebarMenu>
                    {items.map((item) => {
                        return (
                                <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={true}
                                >
                                    <SidebarMenuItem data-selected={true}>
                                        <SidebarGroupLabel>{item.labelTitle}</SidebarGroupLabel>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}>
                                                {item.icon && <item.icon className="h-4 w-4"/>}
                                                <span>{item.title}</span>
                                                <ChevronRight
                                                        className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem) => {
                                                    let isActive = subItem.url===pathname;

                                                    if (
                                                            subItem.url==='/my-advert' &&
                                                            pathname.includes('/see-advert') &&
                                                            isViewingOwnAdvert
                                                    ) isActive = true;

                                                    return (
                                                            <SidebarMenuSubItem key={subItem.title}
                                                            >
                                                                <SidebarMenuSubButton asChild>
                                                                    {subItem.onClick ? (
                                                                            <button
                                                                                    onClick={subItem.onClick}
                                                                                    className="flex w-full text-left gap-2"
                                                                            >
                                                                                <span>{subItem.title}</span>
                                                                            </button>
                                                                    ):(
                                                                            <Link to={subItem.url}
                                                                                  className="flex w-full text-left gap-2">
                                                                                <span className={isActive ? "underline":""}>{subItem.title}</span>
                                                                            </Link>
                                                                    )}
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                    )
                                                })}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroup>
    )
}
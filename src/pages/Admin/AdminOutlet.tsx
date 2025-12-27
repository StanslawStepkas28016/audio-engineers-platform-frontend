import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import React from "react";
import {SidebarSiteContentHeader} from "@/components/sidebar/sidebar-site-content-header.tsx";
import {Outlet} from "react-router-dom";
import {AdminAppSideBar} from "@/components/sidebar/admin-app-side-bar.tsx";

export const AdminOutlet = () => {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AdminAppSideBar variant="inset"/>
            <SidebarInset>
                <SidebarSiteContentHeader/>
                <div className="flex flex-1 flex-col">
                    <Outlet/>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
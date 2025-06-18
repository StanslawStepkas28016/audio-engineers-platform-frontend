import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import React from "react";
import {SiteContentHeader} from "@/components/sidebar/site-content-header.tsx";
import {Outlet} from "react-router-dom";
import {ClientAppSideBar} from "@/components/sidebar/client-app-side-bar.tsx";

export const ClientHomepage = () => {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <ClientAppSideBar variant="inset"/>
            <SidebarInset>
                <SiteContentHeader/>
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <Outlet/>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AudioEngineerAppSideBar} from "@/components/sidebar/audio-engineer-app-side-bar.tsx";
import React from "react";
import {SidebarSiteContentHeader} from "@/components/sidebar/sidebar-site-content-header.tsx";
import {Outlet} from "react-router-dom";

export const AudioEngineerOutletPlaceholder = () => {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AudioEngineerAppSideBar variant="inset"/>
            <SidebarInset>
                <SidebarSiteContentHeader/>
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
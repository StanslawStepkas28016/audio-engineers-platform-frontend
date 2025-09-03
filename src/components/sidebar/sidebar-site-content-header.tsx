import {Separator} from "@/components/ui/separator.tsx"
import {SidebarTrigger} from "@/components/ui/sidebar.tsx"
import {useChatStore} from "@/stores/useChatStore";
import {useUserStore} from "@/stores/useUserStore";
import {MessageCircleMore} from "lucide-react";

export function SidebarSiteContentHeader() {
    const {isAuthenticated} = useUserStore();
    const {selectedUserData, isOnline} = useChatStore();

    return (
        <header
            className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1"/>
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                {
                    (isAuthenticated && selectedUserData.idUser) && (
                        <div className="flex justify-between gap-2">
                            <p>
                                {selectedUserData.firstName} {selectedUserData.lastName}
                            </p>

                            <p className={isOnline ? "text-green-400" : "text-red-500"}> {<MessageCircleMore/>}
                            </p>
                        </div>
                    )
                }
                <div className="ml-auto flex items-center gap-2">
                </div>
            </div>
        </header>
    )
}

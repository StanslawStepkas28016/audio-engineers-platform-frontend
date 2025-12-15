import {Outlet} from "react-router-dom";

export const GuestOutletWithoutSidebar = () => {
    return (
        <div className="flex flex-1 flex-col">
            <Outlet/>
        </div>
    );
}
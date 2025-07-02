import {userStore} from "@/lib/userStore.ts";
import {SeeAdvert} from "@/pages/Shared/SeeAdvert.tsx";

export const AudioEngineerSeeYourAdvert = () => {
    const {userData} = userStore();
    return (
        <SeeAdvert idUser={userData.idUser}/>
    );
}
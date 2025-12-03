import {useTranslation} from "react-i18next";
import {useIsMobile} from "@/hooks/use-mobile.ts";

export const SeeGuide = () => {
    const {t} = useTranslation();
    const isMobile = useIsMobile();

    return (
            <div className="flex flex-col items-center">
                <div className="justify-center text-center ">
                    <h1 className="text-3xl font-bold m-10">
                        {t("Shared.SeeGuide.title")}
                    </h1>
                    <p className="text-muted-foreground whitespace-pre-line m-5">
                        {t("Shared.SeeGuide.short-description")}
                        {isMobile && <><br/><br/></>}
                        {t("Shared.SeeGuide.description")}
                    </p>

                    <h2 className="text-2xl font-bold m-5">
                        {t("Common.client-role")}
                    </h2>

                    <p className="text-muted-foreground whitespace-pre-line m-5">
                        {t("Shared.SeeGuide.client-description-pt-1")}
                    </p>

                    <div className="flex items-center justify-center">
                        <img src={t("Shared.SeeGuide.message-engineer-path")} className="max-w-3/4"
                             alt="message-engineer-guide"/>
                    </div>

                    <p className="text-muted-foreground whitespace-pre-line mb-5">
                        {t("Shared.SeeGuide.client-description-pt-2")}
                    </p>

                    <div className="flex items-center justify-center">
                        <img src={t("Shared.SeeGuide.attach-file-path")} className="max-w-3/4"
                             alt="message-engineer-guide"/>
                    </div>

                    <p className="text-muted-foreground whitespace-pre-line">
                        {t("Shared.SeeGuide.client-description-pt-3")}
                    </p>

                    <h2 className="text-2xl font-bold m-5">
                        {t("Common.audio-engineer-role")}
                    </h2>

                    <p className="text-muted-foreground whitespace-pre-line">
                        {t("Shared.SeeGuide.audio-engineer-description-pt-1")}
                    </p>

                    <div className="flex items-center justify-center mt-5">
                        <img src={t("Shared.SeeGuide.add-advert-path")} className="max-w-3/4"
                             alt="message-engineer-guide"/>
                    </div>

                    <p className="text-muted-foreground whitespace-pre-line mb-5">
                        {t("Shared.SeeGuide.audio-engineer-description-pt-2")}
                    </p>

                    <div className="flex items-center justify-center">
                        <img src={t("Shared.SeeGuide.edit-advert-path")} className="max-w-3/4"
                             alt="message-engineer-guide"/>
                    </div>

                    <p className="text-muted-foreground whitespace-pre-line mb-5">
                        {t("Shared.SeeGuide.audio-engineer-description-pt-3")}
                    </p>

                    <div className="flex items-center justify-center mb-5">
                        <img src={t("Shared.SeeGuide.notification-path")} className="max-w-3/4"
                             alt="message-engineer-guide"/>
                    </div>
                </div>
            </div>
    );
}
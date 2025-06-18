import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function transformDate(date: Date): string {
    const strings = date.toString().split("T");
    const datePart = strings[0].split("-").join(".");
    const timePart = strings[1].split(":");
    return datePart + " | " + timePart[0] + ":" + timePart[1];
}

export function transformPlaylistUrlToEmbedUrl(url: string): string {
    const regex = /https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)(\?si=[a-zA-Z0-9]+)?/;
    const match = url.match(regex);
    if (match) {
        return `https://open.spotify.com/embed/playlist/${match[1]}`;
    }
    return url; // Return original URL if it doesn't match the pattern
}
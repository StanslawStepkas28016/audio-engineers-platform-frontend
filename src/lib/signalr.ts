import * as signalR from '@microsoft/signalr';

export const signalrConnection = new signalR.HubConnectionBuilder()
    .withUrl(import.meta.env.VITE_BACKEND_HUB)
    .withAutomaticReconnect()
    .build();

signalrConnection.start()
    .catch(err => {
        console.error(err)
    });
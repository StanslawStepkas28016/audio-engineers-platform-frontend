export type AdvertSummary = {
    idAdvert: string,
    title: string,
    idUser: string,
    userFirstName: string,
    userLastName: string,
    dateCreated: Date,
    price: string,
    descriptionShort: string,
    categoryName: string,
    coverImageKey: string,
    coverImageUrl: string,
    description: string,
}

export type AdvertSummariesPaginated = {
    items: AdvertSummary[];
    page: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export type Advert = {
    idUser: string,
    idAdvert: string,
    title: string,
    description: string,
    price: number,
    categoryName: string,
    coverImageUrl: string,
    portfolioUrl: string,
    userFirstName: string,
    userLastName: string,
    dateCreated: Date,
    dateModified: Date,
}

export type Review = {
    idReview: string,
    clientFirstName: string,
    clientLastName: string,
    content: string,
    satisfactionLevel: number,
    dateCreated: Date,
}

export type ReviewsPaginated = {
    items: Review[],
    page: number,
    pageSize: number,
    totalCount: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
}

export type UserChatData = {
    idUser: string,
    firstName: string,
    lastName: string,
    unreadCount: number
}

export type MessageT = {
    idMessage: string,
    idUserSender: string,
    isRead: boolean,
    senderFirstName: string,
    senderLastName: string,
    textContent: string,
    fileName: string,
    fileUrl: string,
    dateSent: string,
}
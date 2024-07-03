
//Games Related

export interface Game {
    id: number;
    title: string;
    thumbnail: string;
    genre: string;
    short_description: string;
    platform: string;
    publisher: string;
    developer: string;
    release_date: string;
    game_url: string;
}



//User Related

export interface User {
    _id?: string;
    name?: string;
    favoriteGames: number[];
}



//Nav Related

export interface NavLinkType {
    to: string;
    icon: JSX.Element;
    label: string;
}
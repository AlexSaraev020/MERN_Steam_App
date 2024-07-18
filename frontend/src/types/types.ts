
//Games Related

export interface Game {
    [x: string]: any;
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
    name: string;
    email: string;
    description: string;
    image: string;
    favoriteGames: number[],
}


export interface DecodedToken {
    userId: string;
    userName: string;
    email: string;
    description: string;
    image: string;
    favoriteGames: number[],
}


//Nav Related

export interface NavLinkType {
    to: string;
    icon: JSX.Element;
    label: string;
}

//Games Related

export interface Game {
    id: number;
    title: string;
    thumbnail: string;
    genre: { id: string }[];
    short_description: string;
}




//User Related



export interface UserProps {
    username?: string;
}
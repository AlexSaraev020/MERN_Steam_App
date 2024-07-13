import { createContext, useContext, useState, ReactNode } from "react";
import { Game } from "../types/types";

interface GamesContextType {
    gamesData: GamesData | null;
    setGamesData: (gamesData: GamesData | null) => void;
    favoriteGames: Game[];
    favoriteButton: boolean;
    setFavoriteGames: (games: Game[]) => void;
    setFavoriteButton: (button: boolean) => void;
}

interface GamesData {
    popular: Game[];
    latestReleases: Game[];
}

export const GamesContext = createContext<GamesContextType | undefined>(undefined)



export const GamesProvider = ({ children }: { children: ReactNode }) => {
    const [gamesData, setGamesData] = useState<GamesData | null>(null);
    const [favoriteGames, setFavoriteGames] = useState<Game[] >([]);
    const [favoriteButton, setFavoriteButton] = useState<boolean>(false);
    return (
        <GamesContext.Provider value={{ setGamesData , gamesData,  favoriteGames, setFavoriteGames , favoriteButton, setFavoriteButton }}>
            {children}
        </GamesContext.Provider>
    )
}



export const useGames = () => {
    const context = useContext(GamesContext);
    if (context === undefined) {
        throw new Error('useGames must be used within a GamesProvider')
    }
    return context
}
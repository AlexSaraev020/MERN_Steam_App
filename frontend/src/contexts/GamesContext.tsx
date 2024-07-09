import { createContext, useContext, useState, ReactNode } from "react";
import { Game } from "../types/types";

interface GamesContextType {
    allGames?: Game[] | undefined;
    favoriteGames: Game[];
    favoriteButton: boolean;
    setAllGames?: (allGames: Game[] | undefined) => void;
    setFavoriteGames: (games: Game[]) => void;
    setFavoriteButton: (button: boolean) => void;
}

export const GamesContext = createContext<GamesContextType | undefined>(undefined)



export const GamesProvider = ({ children }: { children: ReactNode }) => {
    const [allGames, setAllGames] = useState<Game[] | undefined>(undefined);
    const [favoriteGames, setFavoriteGames] = useState<Game[] >([]);
    const [favoriteButton, setFavoriteButton] = useState<boolean>(false);
    return (
        <GamesContext.Provider value={{ allGames, favoriteGames, setFavoriteGames, setAllGames , favoriteButton, setFavoriteButton }}>
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
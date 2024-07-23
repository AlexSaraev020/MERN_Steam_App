import { useRef } from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Game } from "../../types/types";
import RecommendedByGenre from "../homepage/recommended/RecommendedByGenre";
import FavoriteButton from "../favorite/FavoriteButton";
import { useGames } from "../../contexts/GamesContext";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import { useThemes } from "../../contexts/ThemeContext";

const GamePage = () => {
    const { id } = useParams<{ id: string | undefined }>();
    const [gamesByGenre, setGamesByGenre] = useState<Game[]>([]);
    const [game, setGame] = useState<Game | undefined>(undefined);
    const { gamesData, setFavoriteButton } = useGames()
    const { userId } = useUser()
    const getTheGame = useRef<HTMLAnchorElement>(null)
    const { theme } = useThemes()

    useEffect(() => {

    }, [])

    const getTheGameButton = () => {
        if (getTheGame.current) {
            getTheGame.current.click()
        }
    }

    useEffect(() => {
        const getFavorite = async () => {
            try {
                if (userId && id) {
                    const response = await axios.get(`http://localhost:3001/user/${userId}`);
                    const numberId = parseInt(id)
                    if (response.status === 200) {
                        const favoriteGameIds = response.data.userFavorite;
                        if (favoriteGameIds.includes(numberId)) {
                            setFavoriteButton(true)
                        } else {
                            setFavoriteButton(false)
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching favorite games:', error);
            }
        };
        getFavorite();
    }, [game, id, setFavoriteButton, userId])


    useEffect(() => {
        const gameFound = gamesData?.popular?.find(index => index.id.toString() === id);
        setGame(gameFound)
        if (gamesData?.popular) {
            const gameGenre = gamesData?.popular?.filter(item => item.genre === game?.genre);
            setGamesByGenre(gameGenre);
        }
    }, [game?.genre, id, gamesData?.popular])


    return (
        <div className={`flex flex-col min-h-screen relative text-white transition-opacity duration-500 ease-in-out animate-fadeIn mb-20`}>
            <div className={`w-full flex items-center justify-center z-10`}>
                <div className={`rounded-t-lg w-11/12 md:w-[95%] bg-gradient-to-r from-${theme}-900/10 via-${theme}-900/10 to-${theme}-900/10 lg:w-5/6 flex flex-col p-8 mt-4 border-2 rounded-xl border-${theme}-500 shadow-glow shadow-${theme}-500`}>
                    <div className={`flex flex-col xl:flex-row w-full`}>
                        <div className={`w-full xl:w-7/12 mb-4 xl:mb-0`}>
                            <img className={`w-full rounded-xl shadow-md hover:scale-105 transition-transform duration-300`} src={game?.thumbnail} alt={game?.title} />
                        </div>
                        <div className={`w-full xl:w-5/12 xl:pl-8 flex flex-col justify-between font-mono`}>
                            <div className={`space-y-4`}>
                                <h2 className={`text-2xl lg:text-4xl xl:text-5xl font-extrabold`}>{game?.title}</h2>
                                <h3 className={`text-sm xl:text-xl`}>Genre: <span className={`text-${theme}-500 font-bold`}>{game?.genre}</span></h3>
                                <p className={`text-sm xl:text-lg text-gray-400`}>{game?.short_description}</p>
                                <h3 className={`text-sm xl:text-lg`}>Developer: <span className={`text-${theme}-500 font-bold text-md xl:text-xl`}>{game?.developer}</span></h3>
                                <h3 className={`text-sm xl:text-lg`}>Publisher: <span className={`text-${theme}-500 font-bold text-md xl:text-xl`}>{game?.publisher}</span></h3>
                                <h3 className={`text-sm xl:text-lg`}>Platform: <span className={`text-zinc-600 font-bold text-md`}>{game?.platform}</span></h3>
                                <h3 className={`text-sm xl:text-lg`}>Release: <span className={`text-zinc-600 font-bold text-md`}>{game?.release_date}</span></h3>
                            </div>
                            <div className={`flex flex-col xl:flex-row items-start xl:items-center mt-4 space-y-2 xl:space-y-0 xl:space-x-4`}>
                                <button onClick={getTheGameButton} className={` text-white flex items-center justify-center w-44 hover:text-${theme}-500 hover:scale-105 transition-all bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 shadow-md shadow-zinc-800 border-2 border-zinc-700 hover:shadow-${theme}-500 font-medium rounded-lg text-lg xl:text-xl px-5 py-3 focus:outline-none duration-500`}>
                                    <a ref={getTheGame} href={game?.game_url} target="_blank" rel="noopener noreferrer">Get the game</a>
                                </button>
                                <div className={`w-12`}>
                                    <FavoriteButton gameId={game?.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`block mt-8`}>
                        <RecommendedByGenre genre={game?.genre} gameId={game?.id} gamesByGenre={gamesByGenre} />
                    </div>
                </div>
            </div>
        </div>


    );
};

export default GamePage;

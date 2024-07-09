import { useContext } from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Game } from "../../types/types";
import RecommendedByGenre from "../homepage/recommended/RecommendedByGenre";
import FavoriteButton from "../favorite/FavoriteButton";
import { useGames } from "../../contexts/GamesContext";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";

const GamePage = () => {

    const { id } = useParams<{ id: string | undefined }>();
    const [gamesByGenre, setGamesByGenre] = useState<Game[]>([]);
    const [game, setGame] = useState<Game | undefined>(undefined);
    const { allGames, setFavoriteButton, favoriteGames } = useGames()
    const { user } = useUser()



    useEffect(() => {

        const getFavorite = async () => {

            try {
                if (user && id) {
                    const response = await axios.get(`http://localhost:3001/user/${user.userId}`);
                    const numberId = parseInt(id)
                    if (response.status === 200) {
                        const favoriteGameIds = response.data.userFavorite;
                        if (favoriteGameIds.includes(numberId)){
                            setFavoriteButton(true)
                        }else{
                            setFavoriteButton(false)
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching favorite games:', error);
            }
        };
        getFavorite();
    }, [game, id, setFavoriteButton, user])


    useEffect(() => {
        const gameFound = allGames?.find(index => index.id.toString() === id);
        setGame(gameFound)
        if (allGames) {
            const gameGenre = allGames?.filter(item => item.genre === game?.genre);
            setGamesByGenre(gameGenre);
        }
    }, [game?.genre, allGames, id])


    return (
        <div className="flex flex-col bg-gray-300 min-h-screen relative text-white">
            <img className='h-full w-full absolute object-cover blur-md' alt='backgroundLogin' src={game?.thumbnail} />
            <div className='absolute inset-0 bg-zinc-950 opacity-80'></div>
            <div className="w-full flex items-center justify-center z-10">
                <div className="rounded-t-lg w-full md:w-[95%] lg:w-5/6 flex flex-col bg-zinc-900 p-8 mt-4">

                    <div className="flex flex-col xl:flex-row w-full">
                        <div className="w-full xl:w-7/12 mb-4 xl:mb-0">
                            <img className="w-full rounded-xl" src={game?.thumbnail} alt={game?.title} />
                        </div>
                        <div className="w-full xl:w-5/12 xl:pl-4 flex flex-col justify-between">
                            <div className="space-y-3">
                                <h2 className="text-xl lg:text-3xl xl:text-5xl font-bold ">{game?.title}</h2>
                                <h2 className="text-sm xl:text-xl">Genre : <span className="text-emerald-400 font-bold">{game?.genre}</span></h2>
                                <p className="text-sm xl:text-lg text-gray-400">{game?.short_description}</p>
                                <h2 className="text-sm xl:text-lg">Developer : <span className="text-emerald-400 font-bold text-md xl:text-xl">{game?.developer}</span></h2>
                                <h2 className="text-sm xl:text-lg">Publisher : <span className="text-emerald-400 font-bold text-md xl:text-xl">{game?.publisher}</span></h2>
                                <h2 className="text-sm xl:text-lg">Platform : <span className="text-gray-400 font-bold text-md">{game?.platform}</span></h2>
                                <h2 className="text-sm xl:text-lg">Release : <span className="text-gray-400 font-bold text-md">{game?.release_date}</span></h2>
                            </div>
                            <button className="text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg mt-2 xl:mt-0 text-lg xl:text-xl px-5 py-2 focus:outline-none xl:w-48 xl:h-14">
                                <a className="" href={game?.game_url} target="_blank" rel="noopener noreferrer">
                                    Get the game
                                </a>
                            </button>
                            <button className="flex items-center text-white bg-inherit border-2 border-emerald-500 hover:bg-emerald-900 px-2 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg mt-2 xl:mt-0 text-lg xl:text-lg  focus:outline-none xl:w-48 xl:h-14">
                                <div className="w-12">
                                    <FavoriteButton gameId={game?.id} />
                                </div>
                                <label className="hover:cursor-pointer" htmlFor="favoriteButton">Add to favorite</label>
                            </button>
                        </div>
                    </div>
                    <div className="block mt-4">
                        <RecommendedByGenre genre={game?.genre} gamesByGenre={gamesByGenre} />
                    </div>
                </div>
            </div>
        </div>


    );
};

export default GamePage;

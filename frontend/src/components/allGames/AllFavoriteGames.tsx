import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useGames } from "../../contexts/GamesContext";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import allGames from "./allGames";


const AllFavoriteGames = () => {

    const { gamesData , setFavoriteGames , favoriteGames} = useGames();
    const { user } = useUser()
    const { pathname } = useLocation();


    useEffect(() => {
        const getFavorite = async () => {
            try {
                if (user) {
                    const response = await axios.get(`http://localhost:3001/user/${user.userId}`);
                    if (response.status === 200) {
                        const favoriteGameIds = response.data.userFavorite;
                        if (gamesData?.popular) {
                            setFavoriteGames(gamesData.popular.filter((game) => favoriteGameIds.includes(game.id)));
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching favorite games:', error);
            }
        };
        getFavorite();
    }, [gamesData?.popular, pathname, setFavoriteGames, user, user?.userId]);

    return (
        <div className="flex flex-col bg-inherit min-h-screen text-white w-full transition-opacity duration-500 ease-in-out animate-fadeIn">
            <div className="w-full flex items-center justify-center mt-10">
                <ul className="w-11/12 sm:w-9/12 space-y-20 sm:space-y-8 bg-[#1e1e1e] rounded-t-xl flex flex-col justify-center items-center border-2 border-zinc-800 transition ease-in-out duration">
                    {favoriteGames.slice(0,20).map((game) => (
                        <Link to={`/game/${game.id}`} key={game.id} className="shadow-lg hover:shadow-green-500/70 transition duration-500 delay-150 hover:scale-105 bg-neutral-900 p-2 sm:p-4 w-10/12 sm:w-11/12 flex flex-col sm:flex-row rounded-xl space-x-0 sm:space-x-3 mt-6 sm:mt-10">
                            <div className="flex justify-center items sm:block">
                                <img className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none" src={game.thumbnail} alt={game.title} />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between w-full">
                                <div className="flex flex-col items-center sm:items-start mt-2 sm:mt-0">
                                    <h2 className="text-md lg:text-xl xl:text-2xl font-bold">
                                        {game.title}
                                    </h2>
                                    <h2 className="text-sm xl:text-xl text-emerald-400 font-bold">{game.genre}</h2>
                                    <h2 className="text-gray-400 font-bold text-md">
                                        {game.release_date}
                                    </h2>
                                </div>
                                <div className="flex items-end justify-center sm:justify-end mt-4 sm:mt-0">
                                    <button className="text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 font-bold rounded-lg mt-2 xl:mt-0 text-md md:text-lg xl:text-xl px-2 py-1 md:px-5 md:py-2 focus:outline-none w-full sm:w-auto xl:w-48 xl:h-14">
                                        <a className="" href={game?.game_url} target="_blank" rel="noopener noreferrer">
                                            Get the game
                                        </a>
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AllFavoriteGames;

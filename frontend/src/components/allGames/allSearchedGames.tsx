import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavigationMenu from "../Navigation/NavigationMenu";
import { Game } from "../../types/types";
import { useParams } from "react-router-dom";
import { User } from "../../types/types";

interface AllSearchedGamesProps {
    setUser: (user?: User) => void;
    games?: Game[];
}

const AllSearchedGames: React.FC<AllSearchedGamesProps> = ({ setUser, games }) => {
    const [searchedGames, setSearchedGames] = useState<Game[]>([]);
    const { title } = useParams<{ title: string }>();

    useEffect(() => {
        if (title && games) {
            const filteredGames = games.filter(item => item.title.toLocaleLowerCase().includes(title))
            setSearchedGames(filteredGames)
        }
    }, [title, games]);

    const slicedGames = searchedGames.slice(0, 10);

    return (
        <div className="flex flex-col bg-zinc-900 min-h-screen text-white w-full">
            <div className="mt-6 hidden lg:block">
                <NavigationMenu setUser={setUser} />
            </div>
            <div className="w-full flex items-center justify-center mt-10">
                <ul className="w-11/12 sm:w-9/12 space-y-20 sm:space-y-14 bg-zinc-900 rounded-t-xl flex flex-col justify-start items-center border-t-2 border-x-2 min-h-screen border-emerald-400">
                    {slicedGames.map((game) => (
                        <Link to={`/game/${game.id}`} key={game.id} className=" transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 shadow-gray-800 md:shadow-lg bg-gradient-to-b from-zinc-900 to bg-zinc-900 via-zinc-800 border-b-4 md:border-r-4 border-emerald-500 p-2 sm:p-4 w-10/12 sm:w-11/12 flex flex-col sm:flex-row rounded-xl space-x-0 sm:space-x-3 mt-6 sm:mt-10">
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
                                    <button className="text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 font-bold rounded-lg mt-2 xl:mt-0 text-md md:text-lg xl:text-xl px-2 py-1 md:px-5 md:py-2 focus:outline-none w-full sm:w-auto xl:w-48 xl:h-14">
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
};

export default AllSearchedGames;

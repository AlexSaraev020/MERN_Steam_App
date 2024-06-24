import React from "react";
import { Link } from "react-router-dom";
import Nav from "../Navigation/Nav";
import NavigationMenu from "../Navigation/NavigationMenu";
import { useState, useEffect } from "react";
import { Game } from "../../types/types";
import { fetchAllGames } from "../../actions/apiRequests";



const AllGames = () => {
    const [games, setGames] = useState<Game[]>([])


    useEffect(() => {
        fetchAllGames(setGames)
    }, [setGames])
    const slicedGames = games.slice(0, 10)
    return (
        <div className="flex flex-col bg-zinc-900 min-h-screen text-white w-full">
            <Nav />
            <div className="mt-6">
                <NavigationMenu />
            </div>
            <div className="w-full flex items-center justify-center mt-10">
                <ul className="w-9/12 space-y-14 bg-zinc-900 rounded-t-xl flex flex-col justify-center items-center border-2 border-emerald-400">
                    {slicedGames.map((game) => (
                        <Link to={`/game/${game.id}`} key={game.id} className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 shadow-gray-800 shadow-lg bg-gradient-to-b from-zinc-900 to bg-zinc-900 via-zinc-800 border-r-4 border-emerald-500 p-4 w-11/12 flex rounded-l-xl space-x-3 mt-10">
                            <div>
                                <img className="rounded-l-lg" src={game.thumbnail} alt={game.title} />
                            </div>
                            <div className="flex justify-between w-full">
                                <div className="flex flex-col">
                                    <h2 className="text-md lg:text-xl xl:text-2xl font-bold">
                                        {game.title}
                                    </h2>
                                    <h2 className="text-sm xl:text-xl text-emerald-400 font-bold">{game.genre}</h2>
                                    <h2 className="text-gray-400 font-bold text-md">
                                        {game.release_date}
                                    </h2>
                                </div>
                                <div className="flex items-end">
                                    <button className="text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 font-bold rounded-lg mt-2 xl:mt-0 text-lg xl:text-xl px-5 py-2 focus:outline-none xl:w-48 xl:h-14">
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
    )
}


export default AllGames
import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Game } from "../../types/types";
import { fetchGameDetails } from "../../actions/apiRequests";
import Nav from "../Navigation/Nav";
import NavigationMenu from "../Navigation/NavigationMenu";
import RecommendedByGenre from "../homepage/recommended/RecommendedByGenre";





const GamePage = () => {
    const { id } = useParams<{ id: string | undefined }>();
    const [gamesDetails, setGamesDetails] = useState<Game | null>(null)
    const [gamesByGenre, setGamesByGenre] = useState<Game[]>([])

    useEffect(() => {
        fetchGameDetails(id, setGamesDetails, setGamesByGenre);
    }, [id])

    return (
        <div className="flex flex-col bg-gray-300 min-h-screen relative text-white">
            <img className='h-full w-full absolute object-cover blur-md' alt='backgroundLogin' src={gamesDetails?.thumbnail} />
            <div className='absolute inset-0 bg-zinc-950 opacity-80'></div>
            <Nav />
            <div className="w-full flex items-center justify-center z-10 min-h-screen">
                <div className="rounded-t-lg w-11/12 md:w-5/6 flex flex-col min-h-screen bg-zinc-900 p-8 mt-4">
                    <div className="mb-6 -mt-6 hidden lg:block">
                        <NavigationMenu />
                    </div>

                    <div className="flex flex-col xl:flex-row w-full">
                        <div className="w-full xl:w-7/12 mb-4 xl:mb-0">
                            <img className="w-full rounded-xl" src={gamesDetails?.thumbnail} alt={gamesDetails?.title} />
                        </div>
                        <div className="w-full xl:w-5/12 xl:pl-4 flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl lg:text-3xl xl:text-5xl font-bold ">{gamesDetails?.title}</h2>
                                <h2 className="text-sm xl:text-xl">Genre : <span className="text-emerald-400 font-bold">{gamesDetails?.genre}</span></h2>
                                <p className="text-sm xl:text-lg text-gray-400">{gamesDetails?.short_description}</p>
                                <h2 className="text-sm xl:text-lg">Developer : <span className="text-emerald-400 font-bold text-md xl:text-xl">{gamesDetails?.developer}</span></h2>
                                <h2 className="text-sm xl:text-lg">Publisher : <span className="text-emerald-400 font-bold text-md xl:text-xl">{gamesDetails?.publisher}</span></h2>
                                <h2 className="text-sm xl:text-lg">Platform : <span className="text-gray-400 font-bold text-md">{gamesDetails?.platform}</span></h2>
                                <h2 className="text-sm xl:text-lg">Release : <span className="text-gray-400 font-bold text-md">{gamesDetails?.release_date}</span></h2>
                            </div>
                            <button className="text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg mt-2 xl:mt-0 text-lg xl:text-xl px-5 py-2 focus:outline-none xl:w-48 xl:h-14">
                                <a className="" href={gamesDetails?.game_url} target="_blank" rel="noopener noreferrer">
                                    Get the game
                                </a>
                            </button>
                        </div>
                    </div>
                    <div className="block mt-4">
                        <RecommendedByGenre genre={gamesDetails?.genre} gamesByGenre={gamesByGenre} />
                    </div>
                </div>
            </div>
        </div>


    );
};

export default GamePage;

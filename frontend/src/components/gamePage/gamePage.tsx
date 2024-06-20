import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Game } from "../../types/types";
import { fetchGames } from "../../actions/apiRequests";
import Nav from "../Navigation/Nav";
import RecommendedByGenre from "../homepage/recommended/RecommendedByGenre";





const GamePage = () => {
    const { id } = useParams<{ id: string }>();
    const [gamesDetails, setGamesDetails] = useState<Game | null>(null)
    const [gamesByGenre, setGamesByGenre] = useState<Game[]>([])

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const games = await fetchGames()
                const game = games.find(index => index.id.toString() === id)
                if (game) {
                    const gameGenre = games.filter(item => item.genre === game.genre)
                    setGamesByGenre(gameGenre)
                }
                setGamesDetails(game || null)
            } catch (error) {
                console.error('Error during api request', error)
            }
        }
        fetchGameDetails()
    }, [id])

    return (
        <div className="flex flex-col bg-gray-300 min-h-screen relative text-white">
            <img className='h-full w-full absolute object-cover blur-md' alt='backgroundLogin' src={gamesDetails?.thumbnail} />
            <div className='absolute inset-0 bg-slate-800 opacity-[0.9]'></div>

            <Nav />
            <div className="w-full flex items-center justify-center absolute z-10 top-[10%] h-[90%]">
                <div className="rounded-t-lg md:w-4/6 flex min-h-full bg-slate-800 p-8">
                    <div className="w-7/12">
                        <img className="w-full rounded-xl" src={gamesDetails?.thumbnail} alt={gamesDetails?.title} />
                    </div>
                    <div className="w-5/12 overflow-hidden p-4 flex flex-col space-y-20 relative">
                        <div>
                            <h2 className="text-4xl font-bold ">{gamesDetails?.title}</h2>
                            <h2 className="text-lg">Genre : <span className="text-blue-400 font-bold">{gamesDetails?.genre}</span></h2>
                            <p className="text-wrap text-md text-gray-400">{gamesDetails?.short_description}</p>
                            <h2 className="text-md">Developer : <span className="text-blue-400 font-bold text-xl">{gamesDetails?.developer}</span></h2>
                            <h2 className="text-md">Publisher : <span className="text-blue-400 font-bold text-xl">{gamesDetails?.publisher}</span></h2>
                            <h2 className="text-md">Platform : <span className="text-gray-400 font-bold text-md">{gamesDetails?.platform}</span></h2>
                            <h2 className="text-md">Release : <span className="text-gray-400 font-bold text-md">{gamesDetails?.release_date}</span></h2>
                        </div>

                        <button className=" text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-2xl px-5 py-2.5 focus:outline-none w-52 h-16">
                            <a className="" href={gamesDetails?.game_url} target="_blank" rel="noopener noreferrer">
                                Get the game
                            </a>
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-[30%]">
                <RecommendedByGenre genre={gamesDetails?.genre} gamesByGenre={gamesByGenre} />
            </div>

        </div>
    );
};

export default GamePage;

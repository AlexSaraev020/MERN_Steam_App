import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGames } from "../../contexts/GamesContext";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";

const AllFavoriteGames = () => {

    const { gamesData, setFavoriteGames, favoriteGames } = useGames();
    const { userId } = useUser()
    const { pathname } = useLocation();
    const [nextEnd, setNextEnd] = useState<number>(10)
    const [nextStart, setNextStart] = useState<number>(0)
    const [activeNext, setActiveNext] = useState<boolean>(true)
    const [activePrevious, setActivePrevious] = useState<boolean>(false)
    const [page, setpage] = useState<number>(0)
    const [activePrevPage, setActivePrevPage] = useState<boolean>(false)
    const [activeNextPage, setActiveNextPage] = useState<boolean>(true)


    useEffect(() => {
        const getFavorite = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://localhost:3001/user/${userId}`);
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
    }, [gamesData?.popular, pathname, setFavoriteGames, userId ]);

    const handleNext = () => {
        if (gamesData && nextEnd < gamesData.popular.length) {
            setNextEnd(nextEnd + 10);
            setNextStart(nextStart + 10);
            setpage(page + 1)
        }
    };

    const handlePrevious = () => {
        if (nextStart >= 10) {
            setNextEnd(nextEnd - 10);
            setNextStart(nextStart - 10);
            setpage(page - 1)
        }
    };

    useEffect(() => {
        if (gamesData) {
            const totalGames = favoriteGames.length;
            const totalPages = Math.ceil(totalGames / 10);

            setActiveNext(nextEnd < totalGames);
            setActivePrevious(nextStart > 0);
            setActivePrevPage(page > 0);
            setActiveNextPage(page < totalPages - 1);
        }
    }, [nextStart, nextEnd, gamesData, page, favoriteGames.length]);

    return (
        <div className="flex flex-col bg-inherit text-white w-full transition-opacity duration-500 ease-in-out animate-fadeIn">
            <div className="w-full flex items-center justify-center mt-10">
                <ul className="w-11/12 sm:w-9/12 space-y-20 sm:space-y-8 bg-[#1e1e1e] rounded-xl flex flex-col justify-center items-center border-2 border-zinc-800 transition ease-in-out duration pb-10">
                    {favoriteGames.slice(nextStart, nextEnd).map((game) => (
                        <Link to={`/game/${game.id}`} key={game.id} className="shadow-lg hover:shadow-green-500/70 transition duration-500 delay-100 hover:scale-105 bg-neutral-900 p-2 sm:p-4 w-10/12 sm:w-11/12 flex flex-col sm:flex-row rounded-xl space-x-0 sm:space-x-3 mt-6 sm:mt-10 ease-in-out animate-fadeIn">
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
                    {favoriteGames.length > 10 && <div className="w-10/12 sm:w-11/12 flex py-4 space-x-6 justify-center">
                        {activePrevious && <button className="text-emerald-500 font-mono font-bold text-lg flex items-center justify-center backdrop-blur-lg bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 rounded-md py-2 px-6 shadow-md shadow-zinc-600 hover:shadow-glow hover:shadow-green-500 hover:-translate-y-1 hover:scale-110 duration-700 w-28" onClick={handlePrevious}>Previous</button>}
                        <div className="flex justify-center space-x-3 text-lg font-semibold font-mono">
                            {activePrevPage && <h2 className="text-emerald-500 flex items-center justify-center px-6 border-2 rounded-lg border-zinc-700 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 shadow-md shadow-zinc-600 transition-all duration-500 ease-in-out animate-fadeIn">{page}</h2>}
                            <h2 className="text-emerald-500 flex items-center justify-center px-6 border-2 rounded-lg border-zinc-700 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 shadow-glow shadow-emerald-500 scale-105 -translate-y-1 transition-all duration-500 ease-in-out animate-fadeIn">{page + 1}</h2>
                            {activeNextPage && <h2 className="text-emerald-500 flex items-center justify-center px-6 border-2 rounded-lg border-zinc-700 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 shadow-md shadow-zinc-600 transition-all duration-500 ease-in-out animate-fadeIn">{page + 2}</h2>}
                        </div>

                        {activeNext && <button className="text-emerald-500 font-mono font-bold text-lg  flex items-center justify-center backdrop-blur-lg bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 rounded-md py-2 px-6 shadow-md shadow-zinc-600 hover:shadow-glow hover:shadow-green-500 hover:-translate-y-1 hover:scale-110 duration-700 w-28" onClick={handleNext}>Next</button>}
                    </div>}
                </ul>
            </div>
        </div>
    );
}

export default AllFavoriteGames;

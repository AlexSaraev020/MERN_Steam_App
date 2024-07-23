import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Game } from "../../types/types";
import { useGames } from "../../contexts/GamesContext";
import { useUser } from "../../contexts/UserContext";
import { useThemes } from "../../contexts/ThemeContext";


const AllGames = () => {

    const [slicedGames, setSlicedGames] = useState<Game[]>([]);
    const { gamesData } = useGames();
    const { userId } = useUser()
    const [nextEnd, setNextEnd] = useState<number>(10)
    const [nextStart, setNextStart] = useState<number>(0)
    const [activeNext, setActiveNext] = useState<boolean>(true)
    const [activePrevious, setActivePrevious] = useState<boolean>(false)
    const [page, setpage] = useState<number>(0)
    const [activePrevPage, setActivePrevPage] = useState<boolean>(false)
    const [activeNextPage, setActiveNextPage] = useState<boolean>(true)
    const { theme } = useThemes()


    useEffect(() => {
        if (gamesData?.popular) {
            setSlicedGames(gamesData.popular.slice(nextStart, nextEnd));
        }
    }, [gamesData?.popular, nextEnd, nextStart, userId]);


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
            const totalGames = gamesData.popular.length;
            const totalPages = Math.ceil(totalGames / 10);

            setActiveNext(nextEnd < totalGames);
            setActivePrevious(nextStart > 0);
            setActivePrevPage(page > 0);
            setActiveNextPage(page < totalPages - 1);
        }
    }, [nextStart, nextEnd, gamesData, page]);


    return (
        <div className={`flex flex-col bg-inherit min-h-screen text-white w-full transition-opacity duration-500 ease-in-out animate-fadeIn`}>
            <div className={`w-full flex items-center justify-center mt-10`}>
                <ul className={`w-11/12 sm:w-9/12 md:w-10/12 lg:w-9/12 xl:w-9/12 space-y-10 sm:space-y-8 bg-[#1e1e1e] rounded-xl flex flex-col justify-center items-center border-2 border-${theme}-500 shadow-glow-sm shadow-${theme}-500 transition ease-in-out duration-500 pb-10`}>
                    {slicedGames.map((game) => (
                        <div key={game.id} className={`flex flex-col pb-4 sm:flex-row justify-between items-center sm:items-end w-11/12 shadow-glow-sm shadow-zinc-700 hover:shadow-${theme}-500 transition duration-500 p-2 sm:p-4 delay-100 hover:scale-105 bg-neutral-900 w-10/12 sm:w-11/12 rounded-xl space-y-4 sm:space-y-0 sm:space-x-3 mt-6 sm:mt-10 ease-in-out animate-fadeIn`}>
                            <Link to={`/game/${game.id}`} className="flex flex-col sm:flex-row w-full space-y-4 sm:space-y-0 sm:space-x-4">
                                <div className={`flex justify-center items-center sm:block`}>
                                    <img className={`rounded-t-lg sm:rounded-l-lg sm:rounded-t-none h-full w-full sm:w-[30rem]`} src={game.thumbnail} alt={game.title} />
                                </div>
                                <div className={`flex flex-col sm:flex-row justify-between w-full`}>
                                    <div className={`flex flex-col items-center sm:items-start mt-2 sm:mt-0`}>
                                        <h2 className={`text-md lg:text-xl xl:text-2xl font-bold`}>
                                            {game.title}
                                        </h2>
                                        <h2 className={`text-sm xl:text-xl text-${theme}-400 font-bold`}>{game.genre}</h2>
                                        <h2 className={`text-gray-400 font-bold text-md`}>
                                            {game.release_date}
                                        </h2>
                                    </div>
                                </div>
                            </Link>
                            <button className={`text-white bg-gradient-to-tr mb-20 sm:mb-0 from-zinc-900 via-zinc-800 to-zinc-900 shadow-glow-sm shadow-${theme}-500 transition-all duration-500 focus:ring-4 focus:ring-${theme}-300 font-bold rounded-lg xl:mt-0 text-md md:text-lg xl:text-xl px-2 py-4 md:px-4 md:py-2 focus:outline-none w-6/12 sm:w-56 xl:w-52 xl:h-14`}>
                                <a className="" href={game?.game_url} target="_blank" rel="noopener noreferrer">
                                    Get the game
                                </a>
                            </button>
                        </div>
                    ))}
                    <div className={`w-11/12 sm:w-11/12 flex py-4 space-x-2 sm:space-x-6 justify-center`}>
                        {activePrevious && <button className={`text-${theme}-500 font-mono font-bold text-sm sm:text-lg flex items-center justify-center backdrop-blur-lg bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 rounded-md py-2 px-2 sm:px-6 shadow-md shadow-zinc-600 hover:shadow-glow hover:shadow-${theme}-500 hover:-translate-y-1 hover:scale-110 duration-700 w-20 sm:w-28`} onClick={handlePrevious}>Previous</button>}
                        <div className={`flex justify-center space-x-3 text-lg font-semibold font-mono`}>
                            {activePrevPage && <h2 className={`text-${theme}-500 text-sm sm:text-lg flex items-center justify-center px-3 sm:px-6 border-2 rounded-lg border-zinc-700 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 shadow-md shadow-zinc-600 transition-all duration-500 ease-in-out animate-fadeIn`}>{page}</h2>}
                            <h2 className={`text-${theme}-500 flex items-center text-sm sm:text-lg justify-center px-3 sm:px-6 border-2 rounded-lg border-zinc-700 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 shadow-glow shadow-${theme}-500 scale-105 -translate-y-1 transition-all duration-500 ease-in-out animate-fadeIn`}>{page + 1}</h2>
                            {activeNextPage && <h2 className={`text-${theme}-500 text-sm sm:text-lg flex items-center justify-center px-3 sm:px-6 border-2 rounded-lg border-zinc-700 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 shadow-md shadow-zinc-600 transition-all duration-500 ease-in-out animate-fadeIn`}>{page + 2}</h2>}
                        </div>
                        {activeNext && <button className={`text-${theme}-500 font-mono font-bold text-sm sm:text-lg flex items-center justify-center backdrop-blur-lg bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 rounded-md py-2 px-2 sm:px-6 shadow-md shadow-zinc-600 hover:shadow-glow hover:shadow-${theme}-500 hover:-translate-y-1 hover:scale-110 duration-700 w-20 sm:w-28`} onClick={handleNext}>Next</button>}
                    </div>
                </ul>
            </div>
        </div>

    );
}

export default AllGames;

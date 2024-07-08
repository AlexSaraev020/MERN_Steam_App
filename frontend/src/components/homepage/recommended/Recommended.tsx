import { Link } from "react-router-dom";
import { ReactComponent as LeftArrow } from '../../../icons/leftarrow.svg';
import { ReactComponent as RightArrow } from '../../../icons/rightarrow.svg';
import { Game, User } from "../../../types/types";
import TruncatedName from "../TruncatedName";
import FavoriteButton from "../../favorite/FavoriteButton";
import { useEffect, useRef, useState } from "react";
import { shuffle } from "../../../actions/generalFunctionalities";
import { useGames } from "../../../contexts/GamesContext";




const Recommended = () => {
    const [shuffledGames, setShuffledGames] = useState<Game[]>([])
    const { allGames} = useGames()

    useEffect(() => {
        if (allGames) {
            setShuffledGames(shuffle(allGames))
        }
    }, [allGames, shuffledGames])

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="relative flex flex-col items-center justify-center w-full">
            <h2 className="relative top-0 w-fit h-auto py-4 justify-center flex bg-gradient-to-r items-center from-emerald-500 via-emerald-400 to-emerald-500 bg-clip-text text-2xl xl:text-5xl font-extrabold text-transparent text-center select-auto">
                Recommended games:
            </h2>
            <button
                onClick={scrollLeft}
                className="absolute bottom-28 left-2 sm:left-6 md:left-8 lg:left-20 xl:left-36 z-20 bg-gradient-to-br hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/70 transition-all duration-500 from-zinc-900 via-zinc-800 to-zinc-800 text-white p-2 rounded-full"
            >
                <svg className="h-8 w-8 md:w-10 md:h-10 stroke-emerald-500 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12H18M6 12L11 7M6 12L11 17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

            </button>
            <div className="w-11/12 lg:w-9/12 items-center justify-center flex overflow-hidden" ref={scrollContainerRef}>
                <div className="flex flex-nowrap space-x-6 w-11/12 justify-center ">
                    {shuffledGames.slice(20, 29).map(game => (
                        <div key={game.id} className="relative flex-none w-[20rem] sm:w-[25rem] py-6 snap-center">
                            <Link to={`/game/${game.id}`}>
                                <div className="relative isolate flex flex-col justify-end overflow-hidden h-60 rounded-2xl p-2 transition-all duration-500 hover:-translate-y-6 hover:scale-125 hover:z-10">
                                    <img src={game.thumbnail} alt={game.title} className="absolute inset-0 h-full w-full" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-gray-900/40"></div>
                                    <h3 className="z-10 mt-3 text-lg font-bold text-white"><TruncatedName name={game.title} /></h3>
                                    <div className="z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">City of love</div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={scrollRight}
                className="absolute bottom-28 right-2 sm:right-6 md:right-8 lg:right-20 xl:right-36 z-20 bg-gradient-to-br hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/70 transition-all duration-500 from-zinc-900 via-zinc-800 to-zinc-800 text-white p-2 rounded-full"
            >
                <svg className="h-8 w-8 md:w-10 md:h-10 stroke-emerald-500 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12H18M18 12L13 7M18 12L13 17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

            </button>
        </section>
    )
}


export default Recommended
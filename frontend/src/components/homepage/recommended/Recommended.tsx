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
    const { allGames } = useGames()

    useEffect(() => {
        if (allGames) {
            setShuffledGames(shuffle(allGames))
        }
    }, [allGames, shuffledGames])

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -425,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 425,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="relative flex flex-col items-center justify-center w-full mb-10 mt-10">
            <h2 className="relative w-fit h-auto py-4 justify-center flex bg-gradient-to-r items-center from-emerald-500 via-emerald-400 to-emerald-500 bg-clip-text text-2xl xl:text-5xl font-extrabold text-transparent text-center select-auto">
                Recommended games:
            </h2>
            <div className="flex relative items-center justify-center w-full mt-10 py-14 md:space-x-2">
                <button
                    onClick={scrollLeft}
                    className="absolute md:relative bottom-0 md:bottom-auto w-3/12 flex justify-center md:w-fit left-0 z-20 ml-2  bg-gradient-to-br hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/70 transition-all duration-500 from-zinc-900 via-zinc-800 to-zinc-800 text-white p-2 rounded-full"
                >
                    <svg className="h-8 w-8 md:w-10 md:h-10 stroke-emerald-500 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 12H18M6 12L11 7M6 12L11 17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                </button>
                <div className="w-full md:w-10/12 lg:w-10/12 xl:w-9/12 items-center flex overflow-hidden space-x-10 lg:py-20 px-10" ref={scrollContainerRef}>
                        {shuffledGames.slice(20, 31).map(game => (
                            <Link to={`/game/${game.id}`} key={game.id} className="relative flex-none md:6/12 lg:w-6/12 xl:w-5/12 hover:border-2 hover:border-emerald-500 hover:shadow-glow hover:shadow-emerald-500 transition-all duration-500 hover:z-10 hover:-translate-y-6 hover:scale-105 rounded-2xl">
                                <div className="relative w-full  flex flex-col justify-end overflow-hidden h-36 sm:h-48 md:h-56 lg:h-56 xl:h-72 rounded-2xl p-2 ">
                                    <img src={game.thumbnail} alt={game.title} className="absolute inset-0 h-full w-full" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-gray-900/40"></div>
                                    <h3 className="z-10 mt-3 text-lg font-bold text-white"><TruncatedName name={game.title} /></h3>
                                    <div className="z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">{game.genre}</div>
                                </div>
                            </Link>
                        ))}
                </div>
                <button
                    onClick={scrollRight}
                    className="absolute md:relative bottom-0 md:bottom-auto w-3/12 md:w-fit flex justify-center right-0 mr-2 z-20 bg-gradient-to-br hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/70 transition-all duration-500 from-zinc-900 via-zinc-800 to-zinc-800 text-white p-2 rounded-full"
                >
                    <svg className="h-8 w-8 md:w-10 md:h-10 stroke-emerald-500 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 12H18M18 12L13 7M18 12L13 17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                </button>
            </div>

        </section>
    )
}


export default Recommended
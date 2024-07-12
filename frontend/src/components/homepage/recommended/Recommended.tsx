import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Game } from "../../../types/types";
import { shuffle } from "../../../actions/generalFunctionalities";
import { useGames } from "../../../contexts/GamesContext";

const Recommended = () => {
    const [shuffledGames, setShuffledGames] = useState<Game[]>([]);
    const { allGames } = useGames();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollDirection, setScrollDirection] = useState<'right' | 'left'>('right');


    useEffect(() => {
        if (allGames) {
            setShuffledGames(shuffle(allGames));
        }
    }, [allGames]);

    useEffect(() => {
        const scrollHandler = () => {
            if (scrollRef.current) {
                const container = scrollRef.current;
                if (scrollDirection === 'right') {
                    container.scrollLeft += 1;
                    if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
                        setScrollDirection('left');
                    }
                } else {
                    container.scrollLeft -= 1;
                    if (container.scrollLeft <= 0) {
                        setScrollDirection('right');
                    }
                }
            }
        };

        const interval = setInterval(scrollHandler, 20);

        return () => clearInterval(interval);
    }, [scrollDirection]);

    return (
        <section className="relative flex flex-col items-center justify-center w-full mt-10 md:mb-10">
            <h2 className="font-mono relative w-fit h-auto py-4 justify-center flex bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 bg-clip-text text-2xl xl:text-5xl font-extrabold text-transparent text-center select-auto">
                Recommended games
            </h2>
            <div className="flex relative items-center justify-center w-full md:space-x-4">
                <div ref={scrollRef} className="w-11/12 md:w-10/12 lg:w-10/12 xl:w-9/12 items-center flex lg:scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-zinc-800 overflow-x-scroll space-x-4 py-14 px-9">
                    {shuffledGames.slice(20, 31).map((game) => (
                        <Link
                            to={`/game/${game.id}`}
                            key={game.id}
                            className="relative flex-none w-full md:w-6/12 lg:w-6/12 xl:w-6/12 hover:border-2 hover:border-emerald-500 hover:shadow-glow hover:shadow-emerald-500 transition-all duration-500 hover:z-10 hover:-translate-y-6 hover:scale-105 rounded-2xl"
                        >
                            <div className="relative w-full flex flex-col justify-end overflow-hidden h-36 sm:h-48 md:h-56 lg:h-56 xl:h-72 rounded-2xl p-2">
                                <img src={game.thumbnail} alt={game.title} className="absolute inset-0 h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-gray-900/40"></div>
                                <h3 className="z-10 mt-3 text-lg font-bold text-white truncate">{game.title}</h3>
                                <div className="z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">{game.genre}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Recommended;

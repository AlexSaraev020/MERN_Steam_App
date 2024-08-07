import { Link } from "react-router-dom";
import { Game } from "../../../types/types";
import { useEffect, useRef, useState } from "react";
import { useThemes } from "../../../contexts/ThemeContext";

interface GamesRecommendedByGenreProps {
    gamesByGenre: Game[];
    genre: string | undefined;
    gameId: number | undefined;
}



const RecommendedByGenre: React.FC<GamesRecommendedByGenreProps> = ({ gamesByGenre, genre, gameId }) => {

    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollDirection, setScrollDirection] = useState<'right' | 'left'>('right');
    const recommendedGames = gamesByGenre.filter(game => game.id !== gameId).slice(0, 20);
    const {theme} = useThemes()

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
            <h2 className={`font-mono absolute top-0 left-0 justify-center flex text-zinc-300 text-2xl xl:text-5xl font-extrabold text-transparent text-center select-auto`}>
                More&nbsp;<span className={`text-${theme}-500`}>{genre}</span>&nbsp;games
            </h2>
            <div className="flex relative items-center justify-center w-full md:space-x-4 mt-10">
                <div ref={scrollRef} className={`w-full items-center flex lg:scrollbar-thin scrollbar-thumb-${theme}-500 scrollbar-track-zinc-800 overflow-x-scroll space-x-4 py-14 px-9`}>
                    {recommendedGames.map((game) => (
                        <Link
                            to={`/game/${game.id}`}
                            key={game.id}
                            className={`relative flex-none w-full md:w-6/12 lg:w-6/12 xl:w-6/12 hover:border-2 hover:border-${theme}-500 hover:shadow-glow hover:shadow-${theme}-500 transition-all duration-500 hover:z-10 hover:-translate-y-6 hover:scale-105 rounded-2xl`}
                        >
                            <div className="relative w-full bg-black flex flex-col justify-end overflow-hidden h-36 sm:h-48 md:h-56 lg:h-56 xl:h-72 rounded-2xl p-2">
                                <img src={game.thumbnail} alt={game.title} className="absolute inset-0 h-full w-full object-cover" />
                                <div className={`absolute inset-0 bg-gradient-to-t from-${theme}-950 via-gray-900/40`}></div>
                                <h3 className="z-10 mt-3 text-lg font-bold text-white truncate">{game.title}</h3>
                                <div className="z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">{game.genre}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>


    )
}


export default RecommendedByGenre
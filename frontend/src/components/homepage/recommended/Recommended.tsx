import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Game } from "../../../types/types";

interface RecommendedProps {
categoryName: string;
theme: string;
gamesData: Game[] | undefined
}

const Recommended:React.FC<RecommendedProps> = ({categoryName,theme,gamesData}) => {
    const [scrollDirection, setScrollDirection] = useState<'right' | 'left'>('right');
    const scrollRef = useRef<HTMLDivElement>(null);
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
        <div>
            {gamesData && gamesData.length > 0 &&
                        <section className={`relative flex flex-col items-center justify-center w-full mt-10 md:mb-10`}>
                            <h2 className={`font-mono relative w-fit h-auto justify-center flex text-${theme}-400 text-2xl xl:text-5xl font-extrabold text-center select-auto`}>
                                {categoryName}
                            </h2>
                            <div className={`flex relative items-center justify-center w-full md:space-x-4`}>
                                <div ref={scrollRef} className={`w-11/12 md:w-10/12 lg:w-10/12 xl:w-11/12 items-center flex lg:scrollbar-thin scrollbar-thumb-${theme}-500 scrollbar-track-zinc-800 overflow-x-scroll space-x-4 py-20 px-9`}>
                                    {gamesData?.slice(0, 20).map((game) => (
                                        <Link
                                            to={`/game/${game.id}`}
                                            key={game.id}
                                            className={`relative flex-none w-11/12 md:w-7/12 lg:w-5/12 hover:border-2 hover:border-${theme}-500 hover:shadow-glow hover:shadow-${theme}-500 transition-all duration-500 hover:z-10 hover:-translate-y-6 hover:scale-105 rounded-2xl`}
                                        >
                                            <div className={`relative w-full flex flex-col justify-end overflow-hidden h-36 sm:h-52 md:h-56 lg:h-56 xl:h-72 rounded-2xl p-2`}>
                                                <img src={game.thumbnail} alt={game.title} className={`absolute inset-0 h-full w-full object-cover`} />
                                                <div className={`absolute inset-0 bg-gradient-to-t from-zinc-950 via-gray-900/40`}></div>
                                                <h3 className={`z-10 mt-3 text-lg font-bold text-white truncate`}>{game.title}</h3>
                                                <div className={`z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300`}>{game.genre}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    }
        </div>
    );
};

export default Recommended;

import { ReactComponent as LeftArrow } from '../../../icons/leftarrow.svg';
import { ReactComponent as RightArrow } from '../../../icons/rightarrow.svg';
import { Link } from 'react-router-dom';
import { Carousel } from 'flowbite-react';
import { Game } from '../../../types/types';
import { useEffect, useState } from 'react';
import { useGames } from '../../../contexts/GamesContext';
import { useThemes } from '../../../contexts/ThemeContext';

const CarouselComponent = () => {
    const [shuffledGames, setShuffledGames] = useState<Game[]>([])
    const { gamesData } = useGames()
    const { theme } = useThemes()

    useEffect(() => {
        if (gamesData?.popular) {
            setShuffledGames(gamesData?.popular)
        }
    }, [gamesData])

    return (
        <section className="relative flex w-full justify-center items-center overflow-hidden">
            <Carousel
                leftControl={
                    <div className={`rounded-full absolute left-4 h-10 w-10 sm:w-14 sm:h-14 flex bg-${theme}-500 shadow-glow shadow-${theme}-500 items-center justify-center hover:scale-110 transition-all duration-500`}>
                        <LeftArrow className="w-10 h-10 sm:w-14 sm:h-14 fill-zinc-900" />
                    </div>
                }
                rightControl={
                    <div className={`rounded-full absolute right-4 h-10 w-10 sm:w-14 sm:h-14 flex bg-${theme}-500 shadow-glow shadow-${theme}-500 items-center justify-center hover:scale-110 transition-all duration-500`}>
                        <RightArrow className="w-10 h-10 sm:w-14 sm:h-14 fill-zinc-900" />
                    </div>
                }
                pauseOnHover
                slideInterval={2000}
                indicators={false}
                className="h-[15rem] min-[400px]:h-[20rem] sm:h-[30rem] md:h-[35rem] lg:h-[35rem] xl:h-[40rem] 2xl:h-[45rem] w-11/12 lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
            >
                {shuffledGames.slice(0, 10).map((game) => (
                    <div key={game.id} className="flex flex-col h-fit w-full items-center justify-center overflow-hidden">
                        <div className="relative w-full">
                            <Link to={`/game/${game.id}`} className="font-mono">
                                <img className="scale-1 rounded-lg h-[15rem] min-[400px]:h-[20rem] sm:h-[30rem] md:h-[35rem] lg:h-[35rem] xl:h-[40rem] 2xl:h-[45rem] w-full lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl" src={game.thumbnail} alt={game.title} />
                                <h2 className={`border-t-2 border-${theme}-500 shadow-glow shadow-${theme}-500 absolute inset-x-0 bottom-0 text-white font-bold md:text-xl lg:text-3xl xl:text-3xl bg-black bg-opacity-80 p-2 rounded-b-lg`}>
                                    {game.title}
                                </h2>
                            </Link>
                        </div>
                    </div>
                ))}
            </Carousel>
        </section>
    )
}

export default CarouselComponent

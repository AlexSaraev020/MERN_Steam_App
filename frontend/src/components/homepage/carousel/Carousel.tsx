import { ReactComponent as LeftArrow } from '../../../icons/leftarrow.svg';
import { ReactComponent as RightArrow } from '../../../icons/rightarrow.svg';
import { Link } from 'react-router-dom';
import { Carousel } from 'flowbite-react';
import { Game } from '../../../types/types';
import FavoriteButton from '../../favorite/FavoriteButton';
import { shuffle } from '../../../actions/generalFunctionalities';
import { useEffect, useState } from 'react';
import { useGames } from '../../../contexts/GamesContext';





const CarouselComponent = () => {

    const [shuffledGames, setShuffledGames] = useState<Game[]>([])
    const {allGames} = useGames()

    useEffect(() => {
        if (allGames) {
            setShuffledGames(shuffle(allGames))
        }
    }, [allGames, shuffledGames])

    return (
        <section className="relative flex justify-center items-center">
            <div className="w-full flex flex-col items-center justify-center mt-10 lg:mt-0 ">

                <Carousel
                    leftControl={<LeftArrow className="w-10 h-10 opacity-70 hover:opacity-80" />}
                    rightControl={<RightArrow className="w-10 h-10 opacity-70 hover:opacity-80" />}
                    pauseOnHover
                    slideInterval={5000}
                    indicators={false}
                    className=" h-[15rem] min-[400px]:h-[20rem] sm:h-[30rem] md:h-[35rem] lg:h-[45rem] xl:h-[45rem] w-11/12 sm:w-11/12 md:w-11/12 lg:w-11/12 xl:w-9/12"
                >
                    {shuffledGames.slice(0, 10).map((game) => (
                        <div
                            key={game.id}
                            className="flex flex-col h-full items-center justify-center overflow-hidden"
                        >
                            <div className='relative'>
                                <Link to={`/game/${game.id}`} className="">
                                    <img
                                        className=" scale-1 rounded-lg min-[400px]:h-[20rem] sm:h-[30rem] md:h-[35rem] lg:h-[45rem] xl:h-[45rem]"
                                        src={game.thumbnail}
                                        alt={game.title}
                                    />
                                    <h2 className="absolute inset-x-0 bottom-0 text-white font-bold md:text-xl lg:text-3xl xl:text-3xl bg-black bg-opacity-40 p-2 rounded-b-lg">{game.title}</h2>

                                </Link>
                                <div className='absolute z-10 md:top-0 rounded-t-lg flex justify-end w-full h-12 '>
                                    <div className=' w-24 hidden md:block bg-black bg-opacity-40 h-24'>
                                        <FavoriteButton gameId={game.id} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </Carousel>
            </div>
        </section>
    )
}

export default CarouselComponent





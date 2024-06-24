import { ReactComponent as LeftArrow } from '../../../icons/leftarrow.svg';
import { ReactComponent as RightArrow } from '../../../icons/rightarrow.svg';
import { Link } from 'react-router-dom';
import { Carousel } from 'flowbite-react';
import { Game } from '../../../types/types';
import Navigation from '../../Navigation/NavigationMenu';


interface CarouselProps{
    handleCarouselChange: (id: number) => void;
    games: Game[];
}



const CarouselComponent:React.FC<CarouselProps> = ({handleCarouselChange, games}) => {
    return (
        <section className="relative flex justify-center items-center mt-10 sm:mt-14 md:mt-10 md:mb-10 lg:mt-6 2xl:mt-10">
            <div className="w-full flex flex-col items-center justify-center ">
                <div className="hidden md:block w-full mb-4">
                    <Navigation />
                </div>
                <Carousel
                    leftControl={<LeftArrow className="w-10 h-10 opacity-70 hover:opacity-80" />}
                    rightControl={<RightArrow className="w-10 h-10 opacity-70 hover:opacity-80" />}
                    pauseOnHover
                    slideInterval={5000}
                    indicators={false}
                    className=" h-[300px] sm:h-[400px] md:h-[500px] lg:h-[700px] xl:h-[800px] w-10/12 md:w-10/12"
                    onSlideChange={handleCarouselChange}
                >
                    {games.map((game) => (
                        <div
                            key={game.id}
                            className="flex flex-col h-full items-center justify-center overflow-hidden"
                        >
                            <Link to={`/game/${game.id}`} className="relative">
                                <img
                                    className="scale-1 rounded-lg h-[300px] sm:h-[400px] md:h-[500px] lg:h-[700px] xl:h-[800px] w-full"
                                    src={game.thumbnail}
                                    alt={game.title}
                                />
                                <h2 className="absolute inset-x-0 bottom-0 text-white font-bold text-md xl:text-3xl bg-black bg-opacity-40 p-2 rounded">{game.title}</h2>
                            </Link>
                        </div>
                    ))}
                </Carousel>
            </div>
        </section>
    )
}

export default CarouselComponent





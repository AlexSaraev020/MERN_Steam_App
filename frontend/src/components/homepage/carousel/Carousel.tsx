import { ReactComponent as LeftArrow } from '../../../icons/leftarrow.svg';
import { ReactComponent as RightArrow } from '../../../icons/rightarrow.svg';
import { Link } from 'react-router-dom';
import { Carousel } from 'flowbite-react';
import { Game, User } from '../../../types/types';
import Navigation from '../../Navigation/NavigationMenu';
import FavoriteButton from '../../favorite/FavoriteButton';


interface CarouselProps {
    handleCarouselChange: (id: number) => void;
    games: Game[];
    user?: User;
    setUser: (user?: User) => void;
}



const CarouselComponent: React.FC<CarouselProps> = ({ handleCarouselChange, games , user, setUser }) => {
    return (
        <section className="relative flex justify-center items-center mt-10 sm:mt-14 md:mt-10 md:mb-10 lg:mt-6 2xl:mt-10">
            <div className="w-full flex flex-col items-center justify-center ">
                <div className="hidden lg:block w-full mb-4">
                    <Navigation setUser={setUser} />
                </div>
                <Carousel
                    leftControl={<LeftArrow className="w-10 h-10 opacity-70 hover:opacity-80" />}
                    rightControl={<RightArrow className="w-10 h-10 opacity-70 hover:opacity-80" />}
                    pauseOnHover
                    slideInterval={5000}
                    indicators={false}
                    className=" h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[550px] w-10/12 md:w-8/12"
                    onSlideChange={handleCarouselChange}
                >
                    {games.map((game) => (
                        <div
                            key={game.id}
                            className="flex flex-col h-full items-center justify-center overflow-hidden"
                        >
                            <div className='relative'>
                                <Link to={`/game/${game.id}`} className="relative">
                                    <img
                                        className="scale-1 rounded-lg h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[550px] w-full"
                                        src={game.thumbnail}
                                        alt={game.title}
                                    />
                                    <h2 className="absolute inset-x-0 bottom-0 text-white font-bold text-md xl:text-3xl bg-black bg-opacity-40 p-2 rounded-b-lg">{game.title}</h2>

                                </Link>
                                <div className='absolute top-0 rounded-t-lg flex justify-end w-full h-12 bg-black bg-opacity-40'>
                                    <div className='top-0 w-12'>
                                        <FavoriteButton user={user} gameId={game.id} />
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





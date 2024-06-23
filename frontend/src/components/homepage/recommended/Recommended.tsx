import { Link } from "react-router-dom";
import { ReactComponent as LeftArrow } from '../../../icons/leftarrow.svg';
import { ReactComponent as RightArrow } from '../../../icons/rightarrow.svg';
import { Game } from "../../../types/types";
import TruncatedName from "../TruncatedName";

interface GamesRecommendedProps {
    games1: Game[]
}



const Recommended: React.FC<GamesRecommendedProps> = ({ games1 }) => {
    const recommendedGames = games1.slice(0, 20);
    return (
        <section className="relative w-[97%] xl:w-9/12 mb-4 flex flex-col justify-center items-center mx-auto ">
            <div className="w-full overflow-x-auto space-y-4 mt-4 flex flex-col items-center justify-center">
                <div className="relative flex flex-col items-end w-full sm:w-11/12 xl:w-full overflow-hidden mt-4 py-4 rounded-xl bg-opacity-50">
                    <div className="flex justify-between w-full mb-1 lg:mb-2 -mt-3 lg:mt-0">
                        <h2 className="text-white ml-10 sm:ml-10 md:ml-10 lg:ml-12 2xl:ml-16 font-sans text-sm sm:text-sm md:text-md lg:text-xl font-bold">Recommended:</h2>
                        <Link
                            to='/allgames'
                            className="text-white text-sm sm:text-sm md:text-md lg:text-xl hover:underline font-sans font-bold mr-10 sm:mr-10 md:mr-10 lg:mr-12 2xl:mr-16"
                        >
                            View All games
                        </Link>
                    </div>

                    <div className="relative flex w-full overflow-hidden items-center">
                        <button
                            className="xl:mx-2 text-white p-2 rounded-full hover:bg-opacity-75 z-10"
                            onClick={() => {
                                const container = document.getElementById('gameSlider2');
                                if (container) {
                                    const currentScroll = container.scrollLeft;
                                    const cardWidth = container.offsetWidth;
                                    const centerOffset = Math.floor(cardWidth / 2);

                                    container.scrollTo({
                                        left: currentScroll - centerOffset,
                                        behavior: 'smooth',
                                    });
                                }
                            }}
                        >
                            <LeftArrow className="h-6 w-6 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                        </button>
                        <div id="gameSlider2" className="flex space-x-3 sm:-space-x-6 md:space-x-0 lg:space-x-4 overflow-hidden scrollbar-hide scroll-smooth snap-x snap-mandatory">
                            {recommendedGames.map(game => (
                                <Link to={`/game/${game.id}`} className="relative flex-none w-44 sm:w-60 snap-center h-40 sm:h-36 md:h-40 lg:h-44 xl:h-48" key={game.id}>
                                    <img className="rounded-lg h-44 sm:h-36 md:h-40 lg:h-44 xl:h-48 sm:w-10/12 md:w-11/12 lg:w-full object-cover" src={game.thumbnail} alt={game.title} />
                                    <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 flex items-center sm:w-10/12 md:w-11/12 lg:w-full rounded-b-lg justify-center opacity-100">                                                    <p className="text-white text-lg sm:text-xl font-bold text-center p-x-2"><TruncatedName name={game.title} /></p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <button
                            className="xl:mx-2 text-white p-2 rounded-full hover:bg-opacity-75 z-10"
                            onClick={() => {
                                const container = document.getElementById('gameSlider2');
                                if (container) {
                                    const currentScroll = container.scrollLeft;
                                    const cardWidth = container.offsetWidth;
                                    const centerOffset = Math.floor(cardWidth / 2);

                                    container.scrollTo({
                                        left: currentScroll + centerOffset,
                                        behavior: 'smooth',
                                    });
                                }
                            }}
                        >
                            <RightArrow className="h-6 w-6 lg:w-8 lg:h-8" />
                        </button>
                    </div>

                </div>

            </div>

        </section>
    )
}


export default Recommended
import React from "react";
import { Link } from "react-router-dom";


interface Game {
    id: number;
    name: string;
    background_image: string;
}


interface GamesFilterProps {
    genres: Game[];
    gamesGenre: Game[];
    handleFilterGenre: (id: number) => void;
}

const GamesFilter: React.FC<GamesFilterProps> = ({ genres, handleFilterGenre, gamesGenre }) => {


    return (
        <div>
            <section className="my-8 mx-auto w-[99%] sm:w-[90%] md:w-[95%] lg:w-[95%] xl:w-[95%] 2xl:w-[80%]">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Genres</h2>
                <div className="flex flex-wrap justify-center space-x-4">
                    {genres.map((genre) => (
                        <button
                            key={genre.id}
                            className='whitespace-nowrap px-4 py-2 rounded-full text-white font-bold bg-gray-600'
                            onClick={() => handleFilterGenre(genre.id)}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>
            </section>
            <section className="my-8 mx-auto w-[90%] sm:w-[90%] md:w-[95%] lg:w-[95%] xl:w-[95%] 2xl:w-[80%]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {gamesGenre.map((game) => (
                        <Link to={`/product/${game.id}`} key={game.id} >
                            <div className="relative h-48 sm:h-60 md:h-72 lg:h-80 xl:h-96">
                                <img src={game.background_image} alt={game.name} className="h-full w-full object-cover rounded-lg" />
                                <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center opacity-100">
                                    <p className="text-white text-lg sm:text-xl font-bold text-center p-2">{game.name}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>

    )
}

export default GamesFilter;

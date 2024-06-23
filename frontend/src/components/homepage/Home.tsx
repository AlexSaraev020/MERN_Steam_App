import { useEffect, useState, useCallback } from "react";
import background from '../../images/login.jpg';
import CarouselComponent from "./carousel/Carousel";
import { Game } from "../../types/types";
import Recommended from "./recommended/Recommended";
import { fetchGames } from "../../actions/apiRequests";
import { shuffle } from "../../actions/generalFunctionalities";
import Nav from "../Navigation/Nav";


const Home= () => {

    const [games, setGames] = useState<Game[]>([]);
    const [games1, setGames1] = useState<Game[]>([]);
    const [activeGameIndex, setActiveGameIndex] = useState<number>(0);
    const [backgroundImage, setBackgroundImage] = useState<string>(background);
    
    useEffect(() => {
        const fetchAllGames = async () => {
            try {
                const [games, games1] = await Promise.all([
                    fetchGames(),
                    fetchGames()
                ]);
                setGames(shuffle(games));
                setGames1(games1);
            } catch (err) {
                console.error('Error during API request:', err);
            }
        };
        fetchAllGames();
    }, [fetchGames]);

    useEffect(() => {
        setBackgroundImage(games[activeGameIndex]?.thumbnail || background);
    }, [activeGameIndex, games]);

    const handleCarouselChange = (index: number) => {
        setActiveGameIndex(index);
    };

    return (
        <div className="relative flex min-h-screen flex-col justify-center items-center">
            <img className='h-full w-full absolute object-cover blur-md' alt='backgroundLogin' src={backgroundImage} />
            <div className='absolute inset-0 bg-slate-800 opacity-[0.7]'></div>
            <div className='relative w-full flex flex-col min-h-screen'>
                <Nav />
                <div className="flex flex-col w-full relative">
                    {/* Carousel */}
                    <CarouselComponent games={games} handleCarouselChange = {handleCarouselChange} />
                    {/* Recommended Games */}
                    <Recommended games1={games1} />
                    {/* Genre Filter */}
                    
                    {/* Games Filtered */}

                </div>
            </div>
        </div>
    );
}

export default Home;

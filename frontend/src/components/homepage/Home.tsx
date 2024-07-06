import { useEffect, useState } from "react";
import background from '../../images/login.jpg';
import CarouselComponent from "./carousel/Carousel";
import { Game, User } from "../../types/types";
import Recommended from "./recommended/Recommended";
import { fetchGames } from "../../actions/apiRequests";
import NavigationMenu from "../Navigation/NavigationMenu";

interface HomeProps {
    user?: User
    setUser: (user?: User) => void
    setAllGames: (games?: Game[]) => void;
    setFavoriteGames: (games?: Game[]) => void;
}


const Home: React.FC<HomeProps> = ({ user, setUser, setAllGames , setFavoriteGames }) => {

    const [activeGameIndex, setActiveGameIndex] = useState<number>(0);
    const [backgroundImage, setBackgroundImage] = useState<string>(background);
    const [games, setGames] = useState<Game[]>([])

    useEffect(() => {
        const fetchAllGames = async () => {
            try {
                const [allGamesResponse, gamesResponse] = await Promise.all([
                    fetchGames(),
                    fetchGames()
                ]);
                setAllGames(allGamesResponse);
                setFavoriteGames(allGamesResponse.filter(games => user?.favoriteGames.includes(games.id)));
                setGames(gamesResponse);
            } catch (err) {
                console.error('Error during API request:', err);
            }
        };
        fetchAllGames();
    }, [setAllGames]);
    

    useEffect(() => {
        if (games) {
            setBackgroundImage(games[activeGameIndex]?.thumbnail || background);
        }
    }, [activeGameIndex, games]);

    const handleCarouselChange = (index: number) => {
        setActiveGameIndex(index);
    };

    return (
        <div className="relative flex min-h-screen flex-col justify-center items-center">
            <img className='h-full w-full absolute object-cover ' alt='backgroundLogin' src={backgroundImage} />
            <div className='absolute inset-0 bg-[#171717] opacity-[1]'></div>
            <div className='relative w-full flex flex-col min-h-screen'>
                <div className="flex flex-col w-full relative">
                    {/* Navigation Menu */}
                    <div className="hidden lg:block w-full mb-4">
                        <NavigationMenu setUser={setUser} />
                    </div>
                    {/* Carousel */}
                    <CarouselComponent user={user} games={games} handleCarouselChange={handleCarouselChange} />
                    {/* Recommended Games */}
                    <Recommended user={user} games={games} />
                </div>
            </div>
        </div>
    );
}

export default Home;

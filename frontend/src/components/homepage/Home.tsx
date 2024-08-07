import { useGames } from "../../contexts/GamesContext";
import { useThemes } from "../../contexts/ThemeContext";
import CarouselComponent from "./carousel/Carousel";
import Recommended from "./recommended/Recommended";

const Home = () => {
    const { gamesData } = useGames();
    const { theme } = useThemes()
    
    return (
        <div className="relative flex flex-col justify-center items-center transition-opacity duration-500 ease-in-out animate-fadeIn">
            <div className='relative w-full flex flex-col'>
                <div className="flex flex-col w-full relative">
                    {/* Carousel */}
                    <CarouselComponent />
                    {/* Recommended Games */}
                    <Recommended categoryName={"Latest releases"} theme={theme} gamesData={gamesData?.latestReleases} />
                </div>
            </div>
        </div>
    );
}

export default Home;

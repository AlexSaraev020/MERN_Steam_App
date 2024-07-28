import { useGames } from "../../contexts/GamesContext";
import { useThemes } from "../../contexts/ThemeContext";
import { AllGamesContent } from "./AllGamesContent";

const AllGames = () => {

    const { gamesData } = useGames();
    const { theme } = useThemes()


    return (
        <div className={`flex flex-col bg-inherit min-h-screen text-white w-full transition-opacity duration-500 ease-in-out animate-fadeIn`}>
            <div className={`w-full flex items-center justify-center mt-10`}>
                <AllGamesContent
                allGames={gamesData?.popular}
                theme={theme}
                />
            </div>
        </div>
    );
}

export default AllGames;

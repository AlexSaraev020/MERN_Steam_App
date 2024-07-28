import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Game } from "../../types/types";
import { useParams } from "react-router-dom";
import { useGames } from "../../contexts/GamesContext";
import { useThemes } from "../../contexts/ThemeContext";
import { AllGamesContent } from "./AllGamesContent";




const AllSearchedGames = () => {
    const [searchedGames, setSearchedGames] = useState<Game[]>([]);
    const { title } = useParams<{ title: string }>();
    const { gamesData } = useGames();
    const { theme } = useThemes()
    const [nextEnd, setNextEnd] = useState<number>(10)
    const [nextStart, setNextStart] = useState<number>(0)
    const [activeNext, setActiveNext] = useState<boolean>(true)
    const [activePrevious, setActivePrevious] = useState<boolean>(false)
    const [page, setpage] = useState<number>(0)
    const [activePrevPage, setActivePrevPage] = useState<boolean>(false)
    const [activeNextPage, setActiveNextPage] = useState<boolean>(true)

    useEffect(() => {
        if (title && gamesData?.popular) {
            const filteredGames = gamesData.popular.filter(item => item.title.toLocaleLowerCase().includes(title))
            if (filteredGames.length === 0) {

            } else {
                setSearchedGames(filteredGames)
            }
        }
    }, [title, gamesData?.popular, nextStart, nextEnd]);



    

    useEffect(() => {
        if (gamesData) {
            const totalGames = gamesData.popular.length;
            const totalPages = Math.ceil(totalGames / 10);

            setActiveNext(nextEnd < totalGames);
            setActivePrevious(nextStart > 0);
            setActivePrevPage(page > 0);
            setActiveNextPage(page < totalPages - 1);
        }
    }, [nextStart, nextEnd, gamesData, page]);

    return (
        <div className={`w-full flex ${searchedGames.length === 0 ? 'items-center' : 'items-start'} min-h-[70vh] justify-center text-white pt-10 transition-opacity duration-500 ease-in-out animate-fadeIn`}>
            {searchedGames.length === 0 ?
                <div className={`w-11/12 font-mono md:mt-20 text-sm sm:text-md lg:text-3xl xl:text-4xl font-bold text-zinc-300 flex items-center justify-center `}>
                    <h2>Game with the name: <span className={`text-${theme}-500`}>"{title}"</span> does not exist</h2>

                </div>
                :
                <AllGamesContent
                allGames={searchedGames}
                theme={theme}
                />
            }
        </div>
    );
};

export default AllSearchedGames;

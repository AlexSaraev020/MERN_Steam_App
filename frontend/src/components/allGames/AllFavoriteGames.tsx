import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGames } from "../../contexts/GamesContext";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import { useThemes } from "../../contexts/ThemeContext";
import Cookies from "js-cookie";
import { AllGamesContent } from "./AllGamesContent";

const AllFavoriteGames = () => {

    const { gamesData, setFavoriteGames, favoriteGames } = useGames();
    const { userId } = useUser()
    
    const { theme } = useThemes()
    const navigate = useNavigate()

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            navigate('/')
        }
    })

    useEffect(() => {
        const getFavorite = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`https://gamerslobby-api.onrender.com/user/${userId}`);
                    if (response.status === 200) {
                        const favoriteGameIds = response.data.userFavorite;
                        if (gamesData?.popular) {
                            setFavoriteGames(gamesData.popular.filter((game) => favoriteGameIds.includes(game.id)));
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching favorite games:', error);
            }
        };
        getFavorite();
    }, [gamesData?.popular, setFavoriteGames, userId]);


    return (
        <div className={`w-full flex ${favoriteGames.length === 0 ? 'items-center' : 'items-start'} min-h-[70vh] justify-center text-white pt-10 transition-opacity duration-500 ease-in-out animate-fadeIn`}>
            {favoriteGames.length === 0 ?
                <div className={`w-full font-mono text-xl md:mt-20 md:text-3xl xl:text-4xl font-bold text-${theme}-500 flex flex-col items-center justify-center `}>
                    You have 0 favorite games
                    <h1 className="text-sm font-semibold md:text-xl mt-4">
                        Add at least one favorite game
                    </h1>
                </div>
                :
                <AllGamesContent
                allGames={favoriteGames}
                theme={theme}
                />
            }
        </div>
    );
}

export default AllFavoriteGames;

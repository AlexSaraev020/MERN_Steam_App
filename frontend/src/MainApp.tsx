import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/login/Login";
import SignUp from "./components/signUp/SignUp";
import Home from "./components/homepage/Home";
import GamePage from "./components/gamePage/gamePage";
import AllGames from "./components/allGames/allGames";
import AllSearchedGames from "./components/allGames/allSearchedGames";
import Nav from "./components/Navigation/Nav";
import { useUser } from "./contexts/UserContext";
import { useGames } from "./contexts/GamesContext";
import NavigationMenu from "./components/Navigation/NavigationMenu";
import { useEffect, useState } from "react";
import { fetchGames } from "./actions/apiRequests";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "./types/types";
import Cookies from "js-cookie";


const MainApp = () => {
    const location = useLocation();
    const hideNavOnRoutes = ["/", "/register"];
    const shouldHideNav = hideNavOnRoutes.includes(location.pathname);
    const [isMenuActive, setIsMenuActive] = useState(false);
    const { allGames, setAllGames, setFavoriteGames } = useGames();
    const { user, setUser, setName } = useUser();

    useEffect(() => {
        const fetchAllGames = async () => {
            try {
                const gamesResponse = await fetchGames();
                if (setAllGames) {
                    setAllGames(gamesResponse);
                }
                if (user && setFavoriteGames) {
                    setFavoriteGames(gamesResponse.filter(game => user.favoriteGames.includes(game.id)));
                }
            } catch (err) {
                console.error('Error during API request:', err);
            }
        };

        if (!allGames || allGames.length === 0) {
            fetchAllGames();
        }
    }, [allGames, setAllGames, setFavoriteGames, user]);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            const decodedToken = jwtDecode<DecodedToken>(token);
            if (setUser) {
                setUser(decodedToken);
            }
            if (setName) {
                setName(decodedToken.userName);
            }
        } else {
            if (setName) {
                setName('Guest');
            }
        }
    }, [setName, setUser]);

    return (
        <div className="bg-[#171717]">
            
                    {!shouldHideNav && <Nav setIsMenuActive={setIsMenuActive} isMenuActive={isMenuActive}/>}
                    {!shouldHideNav &&
                        <div className="hidden lg:block w-full mb-4">
                            <NavigationMenu setIsMenuActive={setIsMenuActive} />
                        </div>}
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<SignUp />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/game/:id" element={<GamePage />} />
                        <Route path="/allgames" element={<AllGames />} />
                        <Route path="/allfavoritegames" element={<AllGames />} />
                        <Route path="/searchbytitle/:title" element={<AllSearchedGames />} />
                    </Routes>

                
        </div>
    );
}

export default MainApp
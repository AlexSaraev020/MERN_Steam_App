import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
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
import AllFavoriteGames from "./components/allGames/AllFavoriteGames";
import Footer from "./components/footer/Footer";




const MainApp = () => {
    const location = useLocation();
    const hideNavOnRoutes = ["/login", "/register"];
    const shouldHideNav = hideNavOnRoutes.includes(location.pathname);
    const [isMenuActive, setIsMenuActive] = useState(false);
    const { gamesData, setGamesData } = useGames();
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            if (user?.userName !== "Guest") {

                navigate('/login')
            }

        }
    }, [])


    useEffect(() => {
        const fetchAllGames = async () => {
            try {
                const gamesResponse = await fetchGames();
                console.log(gamesResponse)
                setGamesData(gamesResponse)
                console.log(gamesData)

            } catch (err) {
                console.error('Error during API request:', err);
            }
        };
        fetchAllGames()
        

    }, [setGamesData]);

    if (gamesData) {
        console.log("Games data has been updated:", gamesData);
    }

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            const decodedToken = jwtDecode<DecodedToken>(token);
            if (setUser) {
                setUser(decodedToken);
            }

        }
    }, [setUser]);

    return (
        <div className="bg-[#171717] ">
            {!shouldHideNav && <Nav setIsMenuActive={setIsMenuActive} isMenuActive={isMenuActive} />}

            {!shouldHideNav &&
                <div className="hidden min-[1146px]:block w-full mb-4 ">
                    <NavigationMenu setIsMenuActive={setIsMenuActive} />
                </div>}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/" element={<Home />} />
                <Route path="/game/:id" element={<GamePage />} />
                <Route path="/allgames" element={<AllGames />} />
                <Route path="/allfavoritegames/:user" element={<AllFavoriteGames />} />
                <Route path="/searchbytitle/:title" element={<AllSearchedGames />} />
            </Routes>

            {!shouldHideNav && <Footer />}
        </div>
    );
}

export default MainApp
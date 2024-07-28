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
import AllFavoriteGames from "./components/allGames/AllFavoriteGames";
import Footer from "./components/footer/Footer";
import ProfilePage from "./components/profilePage/ProfilePage";
import { useThemes } from "./contexts/ThemeContext";
import { fetchUser } from "./actions/apiRequests";


const MainApp = () => {
    const location = useLocation();
    const {pathname} = useLocation();
    const hideNavOnRoutes = ["/login", "/register"];
    const shouldHideNav = hideNavOnRoutes.includes(location.pathname);
    const [isMenuActive, setIsMenuActive] = useState(false);
    const { setGamesData } = useGames();
    const { userId, setUser, setUserId } = useUser();
    const navigate = useNavigate();
    const { setTheme } = useThemes()

    useEffect(() => {
        const getUser = async () => {
            try {
                await fetchUser({ navigate, setUserId, setUser, userId })
            } catch (error) {
                console.error(error)
            }
        }
        getUser()
    }, [userId])

    useEffect(() => {
        const fetchAllGames = async () => {
            try {
                const gamesResponse = await fetchGames();
                setGamesData(gamesResponse)
            } catch (err) {
                console.error('Error during API request:', err);
            }
        };
        fetchAllGames()


    }, [setGamesData]);

    useEffect(() => {
        const theme = localStorage.getItem('theme')
        if (theme) {
            setTheme(theme)
        }
    }, []);
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);
    



    return (
        <div className="bg-darkGray-600 min-h-screen relative ">
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
                <Route path="/profile/:user" element={<ProfilePage />} />
            </Routes>

            {!shouldHideNav && <Footer />}
        </div>
    );
}

export default MainApp
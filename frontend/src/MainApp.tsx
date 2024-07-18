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
import { DecodedToken, User } from "./types/types";
import Cookies from "js-cookie";
import AllFavoriteGames from "./components/allGames/AllFavoriteGames";
import Footer from "./components/footer/Footer";
import ProfilePage from "./components/profilePage/ProfilePage";
import axios from "axios";




const MainApp = () => {
    const location = useLocation();
    const hideNavOnRoutes = ["/login", "/register"];
    const shouldHideNav = hideNavOnRoutes.includes(location.pathname);
    const [isMenuActive, setIsMenuActive] = useState(false);
    const { setGamesData } = useGames();
    const { user, userId, setUser , setUserId } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            if (user?.name !== "Guest") {
                navigate('/login')
            }
        }else{
            const decodedToken = jwtDecode<DecodedToken>(token);
            setUserId(decodedToken.userId);
            console.log(userId)
            const getUpdatedUser = async () => {
                try {
                    if (userId) {
                        const response = await axios.get(`http://localhost:3001/user/${userId}`);
                        if (response.status === 200) {
                            setUser(response.data)
                            console.log(user)
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            getUpdatedUser();
        }
        
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


    return (
        <div className="bg-[#171717] min-h-screen">
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
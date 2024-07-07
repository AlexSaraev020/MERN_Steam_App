import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/login/Login";
import SignUp from "./components/signUp/SignUp";
import Home from "./components/homepage/Home";
import GamePage from "./components/gamePage/gamePage";
import AllGames from "./components/allGames/allGames";
import AllSearchedGames from "./components/allGames/allSearchedGames";
import Nav from "./components/Navigation/Nav";
import { UserProvider } from "./contexts/UserContext";
import { GamesProvider } from "./contexts/GamesContext";
import NavigationMenu from "./components/Navigation/NavigationMenu";
import { useState } from "react";


const MainApp = () => {
    const location = useLocation();
    const hideNavOnRoutes = ["/", "/register"];
    const shouldHideNav = hideNavOnRoutes.includes(location.pathname);
    const [isMenuActive, setIsMenuActive] = useState(false);


    return (
        <div className="bg-[#171717]">
            <UserProvider>
                <GamesProvider>
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

                </GamesProvider>
            </UserProvider>
        </div>
    );
}

export default MainApp
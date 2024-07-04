import { Routes , Route , useLocation } from "react-router-dom";
import Login from "./components/login/Login";
import SignUp from "./components/signUp/SignUp";
import Home from "./components/homepage/Home";
import GamePage from "./components/gamePage/gamePage";
import AllGames from "./components/allGames/allGames";
import AllSearchedGames from "./components/allGames/allSearchedGames";
import Nav from "./components/Navigation/Nav";
import { Game, User } from "./types/types";
import { useState } from "react";


const MainApp = () => {
    const location = useLocation();
    const hideNavOnRoutes = ["/", "/register"];
    const shouldHideNav = hideNavOnRoutes.includes(location.pathname);
    const [user, setUser] = useState<User | undefined>(undefined)
    const [allGames, setAllGames] = useState<Game[] | undefined>(undefined);

    return (
        <div className="">
            {!shouldHideNav && <Nav setUser={setUser} />}
            <Routes>
                <Route path="/" element={<Login setUser={setUser} />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/home" element={<Home setAllGames={setAllGames} setUser={setUser} user={user} />} />
                <Route path="/game/:id" element={<GamePage setUser={setUser} user={user} games={allGames}/>} />
                <Route path="/allgames" element={<AllGames allGames={allGames} setUser={setUser}/>} />
                <Route path="/searchbytitle/:title" element={<AllSearchedGames games={allGames} setUser={setUser} />} />
            </Routes>
        </div>
    );
}

export default MainApp
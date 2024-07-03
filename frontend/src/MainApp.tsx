import { Routes , Route , useLocation } from "react-router-dom";
import Login from "./components/login/Login";
import SignUp from "./components/signUp/SignUp";
import Home from "./components/homepage/Home";
import GamePage from "./components/gamePage/gamePage";
import AllGames from "./components/allGames/allGames";
import AllSearchedGames from "./components/allGames/allSearchedGames";
import Nav from "./components/Navigation/Nav";
import { User } from "./types/types";

interface MainAppProps {
    user?: User;
    setUser: (user?: User) => void;
}


const MainApp: React.FC<MainAppProps> = ({user,setUser}) => {
    const location = useLocation();

    const hideNavOnRoutes = ["/", "/register"];

    const shouldHideNav = hideNavOnRoutes.includes(location.pathname);

    return (
        <div className="">
            {!shouldHideNav && <Nav setUser={setUser} />}
            <Routes>
                <Route path="/" element={<Login setUser={setUser} />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/home" element={<Home setUser={setUser} user={user} />} />
                <Route path="/game/:id" element={<GamePage setUser={setUser}/>} />
                <Route path="/allgames" element={<AllGames setUser={setUser}/>} />
                <Route path="/searchbytitle/:title" element={<AllSearchedGames setUser={setUser} />} />
            </Routes>
        </div>
    );
}

export default MainApp
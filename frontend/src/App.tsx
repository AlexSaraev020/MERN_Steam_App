import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/login/Login';
import SignUp from "./components/signUp/SignUp";
import Home from "./components/homepage/Home";
import GamePage from "./components/gamePage/gamePage";
import Nav from "./components/Navigation/Nav";
import AllGames from "./components/allGames/allGames";
import AllSearchedGames from "./components/allGames/allSearchedGames";

function App() {

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<SignUp />} />
                    <Route path="/home" element={<Home/>} />
                    <Route path="/game/:id" element={<GamePage />} />
                    <Route element={<Nav/>} />
                    <Route path="/allgames" element={<AllGames/>}/>
                    <Route path="/searchbytitle/:title" element={<AllSearchedGames/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

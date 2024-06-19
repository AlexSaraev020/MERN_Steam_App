import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/login/Login';
import SignUp from "./components/signUp/SignUp";
import Home from "./components/homepage/Home";
import { useState } from "react";
import GamePage from "./components/gamePage/gamePage";

function App() {
    const [username, setUsername] = useState<string>('');

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login setUsername={setUsername} />} />
                    <Route path="/register" element={<SignUp />} />
                    <Route path="/home" element={<Home username={username} />} />
                    <Route path="/game/:id/:title/:description" element={<GamePage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

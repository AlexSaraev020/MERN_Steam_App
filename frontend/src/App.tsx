import { BrowserRouter } from "react-router-dom";
import MainApp from "./MainApp";
import { UserProvider } from "./contexts/UserContext";
import { GamesProvider } from "./contexts/GamesContext";

function App() {




    return (
        <div className="App h-screen lg:scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-zinc-800 overflow-y-scroll">
            <BrowserRouter>
                <UserProvider>
                    <GamesProvider>
                        <MainApp />
                    </GamesProvider>
                </UserProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;

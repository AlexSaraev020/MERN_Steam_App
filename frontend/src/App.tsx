import { BrowserRouter } from "react-router-dom";
import MainApp from "./MainApp";
import { UserProvider } from "./contexts/UserContext";
import { GamesProvider } from "./contexts/GamesContext";

function App() {




    return (
        <div className="App">
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

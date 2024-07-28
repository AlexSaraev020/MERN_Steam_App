import { BrowserRouter } from "react-router-dom";
import MainApp from "./MainApp";
import { UserProvider } from "./contexts/UserContext";
import { GamesProvider } from "./contexts/GamesContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <UserProvider>
                    <GamesProvider>
                        <ThemeProvider>
                            <MainApp />
                        </ThemeProvider>
                    </GamesProvider>
                </UserProvider>
            </BrowserRouter>

        </div>
    );
}

export default App;

import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import MainApp from "./MainApp";
import { User } from "./types/types";

function App() {

    
    const [user, setUser] = useState<User | undefined>(undefined)

    return (
        <div className="App">
            <BrowserRouter>
                <MainApp user = {user} setUser = {setUser} />
            </BrowserRouter>
        </div>
    );
}

export default App;

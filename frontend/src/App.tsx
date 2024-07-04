import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import MainApp from "./MainApp";
import { User } from "./types/types";

function App() {

    
    

    return (
        <div className="App">
            <BrowserRouter>
                <MainApp />
            </BrowserRouter>
        </div>
    );
}

export default App;

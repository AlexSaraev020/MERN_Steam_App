import React from "react";
import Nav from "../Navigation/Nav";
import NavigationMenu from "../Navigation/NavigationMenu";
import { useState , useEffect , useCallback } from "react";
import { Game } from "../../types/types";
import { fetchAllGames } from "../../actions/apiRequests";



const AllGames = () => {
    const [games, setGames] = useState<Game[]>([])

    useEffect(()=>{
        fetchAllGames(setGames)
        console.log(games)
    }, [])

    return (
        <div className="flex flex-col bg-slate-900 min-h-screen text-white w-full">
            <Nav />
            <NavigationMenu />
            <div className="w-full flex items-center justify-center">
                dasd
            </div>
        </div>
    )
}


export default AllGames
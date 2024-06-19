import React from "react";
import { useParams } from "react-router-dom";

const GamePage: React.FC = () => {
    const { id , title, description } = useParams<{ id: string , title: string, description: string }>();

    return (
        <div>
            <h1>Game Details for ID: {id}</h1>
            <h1>Game Details for title: {title}</h1>
            <p>description : {description}</p>
        </div>
    );
};

export default GamePage;

import { Express } from "express";
import axios from "axios";

export function fetchGames(app: Express){
    app.get('/api/games', async (req, res) => {
        try {
            const response = await axios.get('https://www.freetogame.com/api/games');
            res.json(response.data);
        } catch (error) {
            console.error('Error fetching games:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
}
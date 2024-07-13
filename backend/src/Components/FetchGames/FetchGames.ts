import { Express } from "express";
import axios from "axios";
import UserModel from "../../Models/UserModel";

export function fetchGames(app: Express) {
    app.get('/api/games', async (req, res) => {
        try {
            const responseRelease = await axios.get('https://www.freetogame.com/api/games?sort-by=release-date');
            const responsePopularity = await axios.get('https://www.freetogame.com/api/games?sort-by=popularity');
            
            const combinedResponse = {
                latestReleases: responseRelease.data,
                popular: responsePopularity.data
            };
            
            res.json(combinedResponse);
        } catch (error) {
            console.error('Error fetching games:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
}

export function favoriteGame(app: Express) {
    app.post('/favorite', async (req, res) => {
        const { userId, gameId } = req.body;

        try {
            const user = await UserModel.findByIdAndUpdate(
                userId,
                { $addToSet: { favoriteGames: gameId } },
                { new: true }
            );
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error adding favorite game', error });
        }
    });



    app.delete('/rmfavorite', async (req, res) => {
        const { userId, gameId } = req.body;

        try {
            const user = await UserModel.findByIdAndUpdate(
                userId,
                { $pull: { favoriteGames: gameId } },
                { new: true }
            );
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error removing favorite game', error });
        }
    });

}

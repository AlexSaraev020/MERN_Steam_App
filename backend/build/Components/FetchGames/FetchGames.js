"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteGame = exports.fetchGames = void 0;
const axios_1 = __importDefault(require("axios"));
const UserController_1 = __importDefault(require("../../Models/UserController"));
function fetchGames(app) {
    app.get('/api/games', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const responseRelease = yield axios_1.default.get('https://www.freetogame.com/api/games?sort-by=release-date');
            const responsePopularity = yield axios_1.default.get('https://www.freetogame.com/api/games?sort-by=popularity');
            const combinedResponse = {
                latestReleases: responseRelease.data,
                popular: responsePopularity.data
            };
            res.json(combinedResponse);
        }
        catch (error) {
            console.error('Error fetching games:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }));
}
exports.fetchGames = fetchGames;
function favoriteGame(app) {
    app.post('/favorite', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { userId, gameId } = req.body;
        try {
            yield UserController_1.default.findByIdAndUpdate(userId, { $addToSet: { favoriteGames: gameId } }, { new: true });
            res.status(200).json({ message: 'Added to favorite' });
        }
        catch (error) {
            res.status(500).json({ message: 'Error adding favorite game', error });
        }
    }));
    app.delete('/rmfavorite', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { userId, gameId } = req.body;
        try {
            const user = yield UserController_1.default.findByIdAndUpdate(userId, { $pull: { favoriteGames: gameId } }, { new: true });
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ message: 'Error removing favorite game', error });
        }
    }));
}
exports.favoriteGame = favoriteGame;

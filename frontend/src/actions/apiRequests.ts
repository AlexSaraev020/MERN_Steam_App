import axios from "axios";
import { Game } from "../types/types";

export const fetchGames = async (): Promise<Game[]> => {
  try {
    const response = await axios.get('http://localhost:3001/api/games');
    if (response.status === 200) {
      return response.data as Game[];
    } else {
      throw new Error('Failed to fetch games');
    }
  } catch (err) {
    console.error('Error during API request:', err);
    return [];
  }
};

export const fetchAllGames = async (setGames: React.Dispatch<React.SetStateAction<Game[]>>) => {
  try {
    const games = await fetchGames()
    setGames(games)
  } catch (err) {
    console.error('Error during API request:', err);
  }
};

export const fetchGameDetails = async (id: string | undefined, setGamesDetails: React.Dispatch<React.SetStateAction<Game | null>>, setGamesByGenre: React.Dispatch<React.SetStateAction<Game[]>>) => {
  try {
    const games = await fetchGames();
    const game = games.find(index => index.id.toString() === id);
    if (game) {
      const gameGenre = games.filter(item => item.genre === game.genre);
      setGamesByGenre(gameGenre);
    }
    setGamesDetails(game || null);
  } catch (error) {
    console.error('Error during api request', error);
  }
};
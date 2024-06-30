import axios from "axios";
import { Game } from "../types/types";
import { jwtDecode } from "jwt-decode";

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
    const games = await fetchGames();
    setGames(games);
  } catch (error) {
    console.error(error);
  }

}

export const searchGame = async (setSearchedGames: React.Dispatch<React.SetStateAction<Game[]>>, enteredText: string) => {
  try {
    const games = await fetchGames();
    const filteredGames = games.filter(item => item.title.toLocaleLowerCase().includes(enteredText.toLowerCase()))
    setSearchedGames(filteredGames)
  } catch (error) {
    console.error(error);
  }
}

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

export const fetchUsername = (setUsername: React.Dispatch<React.SetStateAction<string>>) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      console.log(decodedToken)
      setUsername(decodedToken.userName);
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  }
};

export const fetchUserId = (setIdUser: React.Dispatch<React.SetStateAction<number | null>>) => {
  const token = localStorage.getItem('token');

  try {
    if (token) {
      const decodedToken: any = jwtDecode(token);
      setIdUser(decodedToken.userId);
    }
  } catch (error) {
    console.error(error)
  }
};
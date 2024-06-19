import axios from "axios";
import { Game } from "../types/types";

export const fetchGames = async (): Promise<Game[]> => {
  try {
    const response = await axios.get('http://localhost:3001/api/games');
    if (response.status === 200) {
      console.log(response);
      return response.data as Game[];
    } else {
      throw new Error('Failed to fetch games');
    }
  } catch (err) {
    console.error('Error during API request:', err);
    return [];
  }
};
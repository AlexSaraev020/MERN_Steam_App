import axios from "axios";
import { Game } from "../types/types";

interface SortedGames {
  popular: Game[];
  latestReleases: Game[];
}

export const fetchGames = async (): Promise<SortedGames> => {
  try {
    const response = await axios.get<SortedGames>('http://localhost:3001/api/games');
    if (response.status === 200) {
      return response.data as SortedGames;
    } else {
      throw new Error('Failed to fetch games');
    }
  } catch (err) {
    console.error('Error during API request:', err);
    return { popular: [], latestReleases: [] };
  }
};


import axios from "axios";
import { Game } from "../types/types";
import Cookies from "js-cookie";
import { User } from "../types/types";
import { NavigateFunction } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { GamesData } from "../types/types";

const apiUrl = process.env.REACT_APP_SERVER_LINK;


//Get Games!!!

interface SortedGames {
  popular: Game[];
  latestReleases: Game[];
}

export const fetchGames = async (): Promise<SortedGames> => {
  try {
    const response = await axios.get<SortedGames>(`${apiUrl}/api/games`);
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

//User !!!!

interface RegisterUserProps {
  email: string | undefined;
  password: string | undefined;
  name: string | undefined;
  navigate: NavigateFunction;
  setError: (error: string | undefined) => void;
  setClose: (close: boolean) => void;
  setMessage: (message: string | undefined) => void;
}

export const registerUser = async ({ email, password, name, navigate, setClose, setMessage, setError }: RegisterUserProps) => {
  try {
    const response = await axios.post(`${apiUrl}/register`, { name, email, password });
    if (response.status === 200) {
      navigate('/login');
    }
  } catch (error:any) {
    console.error(error);
    setError(error.message)
    setMessage(error.response.data.message)
    setClose(true)
  }
}

interface LoginUserProps {
  email: string | undefined;
  password: string | undefined;
  rememberMe: boolean;
  setUserId: (userId: string | undefined) => void;
  navigate: NavigateFunction;
  setError: (error: string | undefined) => void;
  setClose: (close: boolean) => void;
  setMessage: (message: string | undefined) => void;
}

export const loginUser = async ({ email, password, rememberMe, setUserId, navigate, setError, setClose, setMessage }: LoginUserProps) => {
  try {
    const response = await axios.post(`${apiUrl}/login`, { email, password, rememberMe });
    if (response.status === 200) {
      document.cookie = `token=${response.data.token}; max-age=${rememberMe ? 7 * 24 * 60 * 60 : 60 * 60}; path=/`;
      const token = Cookies.get('token');
      if (token) {
        const decodedToken = jwtDecode<string>(token);
        setUserId(decodedToken);
      }
      if (response.data) {
        navigate('/');
      }
    }
  } catch (error: any) {
    console.error('Error during login:', error);
    setError(error.message)
    setMessage(error.response.data.message)
    setClose(true)
  }
}

interface DecodedUser {
  userId: string | undefined;
}

interface UserParams {
  navigate: NavigateFunction,
  setUserId: (id: string | undefined) => void,
  setUser: (user: User | undefined) => void,
  userId: string | undefined,
}

export const fetchUser = async ({ navigate, setUserId, setUser, userId }: UserParams) => {
  const token = Cookies.get('token');
  if (!token) {
    navigate('/login')
  } else {
    const decodedToken = jwtDecode<DecodedUser>(token);
    setUserId(decodedToken.userId);
    const getUpdatedUser = async () => {
      try {
        if (userId) {
          const response = await axios.get(`${apiUrl}/user/${userId}`);
          if (response.status === 200) {
            setUser(response.data)
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUpdatedUser();
  }
}

interface UpdateUserParams {
  userId: string | undefined;
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
  description: string | undefined;
  setUser: (user: User) => void;
  setEdit: (edit: boolean) => void;
  edit: boolean;
  setClose: (close: boolean) => void;
  setMessage: (message: string | undefined) => void;
}

export const updateUser = async ({ userId, name, email, password, description, setUser, setEdit, edit , setClose, setMessage }: UpdateUserParams) => {
  try {
    const response = await axios.put(`${apiUrl}/userUpdate`, {
      userId: userId,
      userName: name,
      userEmail: email,
      userPassword: password,
      userDescription: description,
    });

    if (response.status === 200) {
      setUser(response.data.user)
      setClose(true)
      setMessage(response.data.message)
    }

    setEdit(!edit);
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

interface DeleteUserParams {
  userId: string | undefined;
  setUser: (user: User | undefined) => void;
  navigate: NavigateFunction,
}

export const deleteUser = async ({ userId, setUser, navigate }: DeleteUserParams) => {
  const response = await axios.delete(`https://gamerslobby-api.onrender.com/deleteUser/${userId}`)

  if (response.status === 200) {
    console.log('Your account deleted successfully')
    Cookies.remove('token');
    localStorage.clear();
    setUser(undefined);
    setTimeout(() => {
      navigate('/login');
    }, 50);
  } else {
    console.log('Your account could not be deleted')
  }
}

//Favorite

interface FavoriteParams {
  userId: string;
  gameId: number | undefined;
  setFavoriteButton: (favoriteButton: boolean) => void
  favoriteButton: boolean;
}

export const addFavorite = async ({ userId, gameId, setFavoriteButton, favoriteButton }: FavoriteParams) => {
  try {
    await axios.post(`${apiUrl}/favorite`, { userId: userId, gameId });
    setFavoriteButton(!favoriteButton);
  } catch (error) {
    console.error(error)
  }
}

export const rmFavorite = async ({ userId, gameId, setFavoriteButton, favoriteButton }: FavoriteParams) => {
  try {
    await axios.delete(`${apiUrl}/rmfavorite`, { data: { userId: userId, gameId } });
    setFavoriteButton(!favoriteButton);
  } catch (error) {
    console.error(error)
  }
}

interface GetFavoriteParams {
  userId: string | undefined;
  gamesData: GamesData | null;
  setFavoriteGames: (games: Game[]) => void;
}

export const getFavorite = async ({ userId, gamesData, setFavoriteGames }: GetFavoriteParams) => {
  try {
    if (userId) {
      const response = await axios.get(`${apiUrl}/user/${userId}`);
      if (response.status === 200) {
        const favoriteGameIds = response.data.userFavorite;
        if (gamesData?.popular) {
          setFavoriteGames(gamesData.popular.filter((game) => favoriteGameIds.includes(game.id)));
        }
      }
    }
  } catch (error) {
    console.error('Error fetching favorite games:', error);
  }
};

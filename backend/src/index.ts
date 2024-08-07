import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './Components/ConnectToDatabase/Mongoose';
import { setupRoutes } from './Components/UserRoutes/AuthRoutes';
import { favoriteGame , fetchGames } from './Components/FetchGames/FetchGames';
import { updateUser } from './Components/UserRoutes/UpdateUser';
import dotenv from 'dotenv'

dotenv.config()
const app = express();
const port = process.env.PORT || 3001
const cookieParser = require("cookie-parser");

app.use(express.json());

app.use(cors({
  origin: "https://gamerslobby.vercel.app",
  methods: ["GET", "POST" , "DELETE" , "PUT"],
  credentials: true,
}));

app.use(cookieParser())

connectToDatabase();

setupRoutes(app);

updateUser(app);

fetchGames(app);


favoriteGame(app);


app.get('/', (req, res) => {
  res.send('Backend server listening');
});

app.listen(port , () => {
  console.log(`Server running at http://localhost:${port}`);
});
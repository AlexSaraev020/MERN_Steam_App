import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './Components/ConnectToDatabase/Mongoose';
import { setupRoutes } from './Components/AuthRoutes/AuthRoutes';
import { checkFavorites  , favoriteGame , fetchGames } from './Components/FetchGames/FetchGames';

const app = express();
const port = 3001;
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST" , "DELETE"],
}));

app.use(cookieParser())

connectToDatabase();

setupRoutes(app);

fetchGames(app)

checkFavorites(app)

favoriteGame(app);


app.get('/', (req, res) => {
  res.send('Backendul funcționează');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


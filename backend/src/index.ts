import express from 'express';
import cors from 'cors';
import axios from 'axios';
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


app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/', (req, res) => {
  res.send('Backend server listening');
});

/* A free Render instance spins down after 15 minutes without inbound traffic and the
   wake costs the next visitor about a minute. Asking for our own /health every 4 minutes
   keeps inbound traffic non-zero, so the service never sleeps.
   shortcut: Render documents the 15-minute rule, not self-ping. If Render ever stops
   counting a service's own requests as inbound, move this to an external monitor. */
const publicUrl = process.env.RENDER_EXTERNAL_URL;
if (process.env.RENDER === 'true' && publicUrl) {
  setInterval(() => {
    axios.get(`${publicUrl}/health`, { timeout: 10000 }).catch(() => {});
  }, 4 * 60 * 1000);
}

app.listen(port , () => {
  console.log(`Server running at http://localhost:${port}`);
});
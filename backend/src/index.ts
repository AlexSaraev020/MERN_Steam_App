import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios'; // Vom folosi axios pentru a face cererile HTTP
import UserModel, { User } from '../src/Models/UserModel';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET" , "POST"],

}));

mongoose.connect('mongodb+srv://Alex:Loperule123%40@cluster0.nxsteee.mongodb.net/users')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

interface RegisterResponse {
    message: string;
}

app.post("/register", async (req: Request<any, any, User>, res: Response<RegisterResponse | User>) => {
    try {
        const { email } = req.body;
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = await UserModel.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

interface LoginResponse {
    message: string;
    username?: string;
}

app.post("/login", async (req: Request<any, any, User>, res: Response<LoginResponse | User>) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            if (user.password === password) {
                res.json({ message: 'success', username: user.name });
            } else {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        } else {
            return res.status(400).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/games', async (req: Request, res: Response) => {
    try {
        const response = await axios.get('https://www.freetogame.com/api/games');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/', (req, res) => {
    res.send('Backendul functioneaza');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

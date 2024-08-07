import { Express } from 'express';
import UserModel from '../../Models/UserController';
import { generateToken } from '../../JWT/JWT';
const bcrypt = require('bcrypt');

export function setupRoutes(app: Express) {
    app.post("/register", async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const existingUser = await UserModel.findOne({ email });
            if (!name || !email || !password) {
                res.status(400).json({ message:'You must complete all the required fields'});
            }
            
            if (existingUser) {
                res.status(400).json({ message: 'User already exists' });
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const newUser = await UserModel.create({ name, email, password: hashedPassword });
                if (newUser) {
                    res.status(200).json(newUser);
                } else {
                    res.status(400).json({message:'Invalid user data'});
                }

            }
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    app.post("/login", async (req, res) => {
        const { email, password, rememberMe } = req.body;
        try {
            const user = await UserModel.findOne({ email });
            if (user) {
                if (await bcrypt.compare(password, user.password)) {
                    const token = generateToken({ userId: user.id.toString() });
                    res.cookie('token', token, {
                        httpOnly: true,
                        sameSite: 'strict'
                    });
                    res.json({
                        _id: user.id,
                        name: user.name,
                        email: user.email,
                        favoriteGames: user.favoriteGames,
                        rememberMe: rememberMe,
                        token: token,
                    });

                } else {
                    res.status(400).json({ message: 'Incorrect password' });
                }
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    app.get('/user/:userId', async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await UserModel.findById( userId);
            if (user) {
                res.status(200).json({
                    userId: user.id,
                    userFavorite: user.favoriteGames,
                    name: user.name,
                    email: user.email,
                    description: user.description,
                });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error });
        }
    });
}
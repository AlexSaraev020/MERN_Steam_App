import { Express } from 'express';
import UserModel from '../../Models/UserModel';
import { generateToken } from '../../JWT/JWT';
const bcrypt = require('bcrypt');


export function setupRoutes(app: Express) {
    app.post("/register", async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const existingUser = await UserModel.findOne({ email });
            if (!name || !email || !password) {
                res.status(400);
                throw new Error('Complete all input fields');
            }

            if (existingUser) {
                res.status(400).json({ message: 'User already exists' });
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const newUser = await UserModel.create({ name, email, password: hashedPassword });
                if (newUser) {
                    res.status(201).json(newUser);
                } else {
                    res.status(400);
                    throw new Error('Invalid user data');
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
                    const token = generateToken({ userId: user.id.toString(),userName:user.name, email: user.email }, rememberMe);
                    const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000;
                    
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: true,
                        maxAge: maxAge,
                        sameSite: 'strict'
                    });
                    
                    res.json({
                        _id: user.id,
                        name: user.name,
                        email: user.email,
                        rememberMe: rememberMe,
                        token: token
                    });
    
                } else {
                    res.status(401).json({ message: 'Invalid credentials' });
                }
            } else {
                res.status(400).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    
    


    //Just for the moment
    app.get('/users', async (req, res) => {
        try {
            const users = await UserModel.find({});
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    });
}



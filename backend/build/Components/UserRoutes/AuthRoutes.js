"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const UserController_1 = __importDefault(require("../../Models/UserController"));
const JWT_1 = require("../../JWT/JWT");
const bcrypt = require('bcrypt');
function setupRoutes(app) {
    app.post("/register", (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            const existingUser = yield UserController_1.default.findOne({ email });
            if (!name || !email || !password) {
                res.status(400).json({ message: 'You must complete all the required fields' });
            }
            if (existingUser) {
                res.status(400).json({ message: 'User already exists' });
            }
            else {
                const salt = yield bcrypt.genSalt(10);
                const hashedPassword = yield bcrypt.hash(password, salt);
                const newUser = yield UserController_1.default.create({ name, email, password: hashedPassword });
                if (newUser) {
                    res.status(200).json(newUser);
                }
                else {
                    res.status(400).json({ message: 'Invalid user data' });
                }
            }
        }
        catch (error) {
            console.error('Error during registration:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }));
    app.post("/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { email, password, rememberMe } = req.body;
        try {
            const user = yield UserController_1.default.findOne({ email });
            if (user) {
                if (yield bcrypt.compare(password, user.password)) {
                    const token = (0, JWT_1.generateToken)({ userId: user.id.toString() });
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
                }
                else {
                    res.status(400).json({ message: 'Incorrect password' });
                }
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }));
    app.get('/user/:userId', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const user = yield UserController_1.default.findById(userId);
            if (user) {
                res.status(200).json({
                    userId: user.id,
                    userFavorite: user.favoriteGames,
                    name: user.name,
                    email: user.email,
                    description: user.description,
                });
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server error', error });
        }
    }));
}
exports.setupRoutes = setupRoutes;

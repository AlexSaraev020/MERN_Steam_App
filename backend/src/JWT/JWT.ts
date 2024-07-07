import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

const TOKEN_KEY: string = process.env.JWT_SECRET as string;

interface UserPayload {
    userId: string;
    userName: string;
    email: string;
    favoriteGames: number[],
}

export function generateToken(userPayload: UserPayload, rememberMe: boolean = false): string {
    const expiresIn = rememberMe ? '7d' : '1h'
    const token: string = jwt.sign(userPayload, TOKEN_KEY, { expiresIn });
    return token;
}


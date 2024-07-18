import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

const TOKEN_KEY: string = process.env.JWT_SECRET as string;

interface UserPayload {
    userId: string;
}

export function generateToken(userPayload: UserPayload): string {
    const token: string = jwt.sign(userPayload, TOKEN_KEY);
    return token;
}


import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

const TOKEN_KEY: string = process.env.JWT_SECRET as string;

interface UserPayload {
    userId: string;
    email: string;
}

export function generateToken(userPayload: UserPayload, rememberMe: boolean = false): string {
    const expiresIn = rememberMe ? '1d' : '1h'
    const token: string = jwt.sign(userPayload, TOKEN_KEY, { expiresIn });
    return token;
}

export function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, TOKEN_KEY) as UserPayload
        return decoded
    } catch (error) {
        console.error('Error verifying JWT token:', error);
        return null;
    }
}


import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient, User } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const prisma = new PrismaClient();

async function DatabaseConnection(): Promise<void> {
    try {
        await prisma.$connect();
        console.log('Database connected');
    } catch (error) {
        console.error('Failed to connect to database:', error);
    }
}

let refreshTokens: string[] = [];

// Type definition for user object payload
interface UserPayload {
    id: number;
    is_admin: boolean;
}

const generateAccessToken = (user: UserPayload): string => 
    jwt.sign({ id: user.id, is_admin: user.is_admin }, process.env.ACCESSTOKENSECRET as string, { expiresIn: '15m' });

const generateRefreshToken = (user: UserPayload): string => 
    jwt.sign({ id: user.id, is_admin: user.is_admin }, process.env.REFRESHTOKENSECRET as string, { expiresIn: '12h' });

// Refresh Token Route
router.post("/refresh", (req: Request, res: Response) => {
    const refreshToken = req.body.token;

    if (!refreshToken) return res.status(401).json("You are not authenticated!");
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json('Refresh token is not valid!');
    }

    jwt.verify(refreshToken, process.env.REFRESHTOKENSECRET as string, (err, user) => {
        if (err) return res.status(403).json("Refresh token is not valid!");

        // Remove old refresh token and create new ones
        refreshTokens = refreshTokens.filter(token => token !== refreshToken);

        const newAccessToken = generateAccessToken(user as UserPayload);
        const newRefreshToken = generateRefreshToken(user as UserPayload);

        refreshTokens.push(newRefreshToken);

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    });
});

// Login Route
router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        return res.status(400).json("Email not found");
    }

    // Assuming passwords are hashed, you'd use bcrypt to compare passwords in production
    // Example: bcrypt.compare(password, user.password)
    if (user.password === password) {
        const accessToken = generateAccessToken({ id: user.id, is_admin: user.is_admin });
        const refreshToken = generateRefreshToken({ id: user.id, is_admin: user.is_admin });

        refreshTokens.push(refreshToken);

        res.json({
            name: user.name,
            email: user.email,
            id: user.id,
            is_admin: user.is_admin,
            accessToken,
            refreshToken,
        });
    } else {
        res.status(400).json("Email or Password Invalid");
    }
});

// Middleware for verifying token
const verify = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.ACCESSTOKENSECRET as string, (err, user) => {
            if (err) return res.status(403).json("Token is not valid");
            req.user = user as JwtPayload;
            next();
        });
    } else {
        res.status(401).json("You are not authenticated");
    }
};

// Logout Route
router.post('/logout', verify, (req: Request, res: Response) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.status(200).json("You logged out successfully");
});

export { router, verify, DatabaseConnection };
import jwt from "jsonwebtoken";
import {DiscordUser, UserPayload} from "../types/discorduser";

const jwtAccessSecret: string = process.env.JWT_ACCESS_SECRET!;
const jwtRefreshSecret: string = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (user: DiscordUser): string => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
        },
        jwtAccessSecret,
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (user: DiscordUser): string => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
        },
        jwtRefreshSecret,
        { expiresIn: '7d' }
    );
};

// 엑세스 토큰 검증(성공시 UserPayload 타입으로 반환)
export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, jwtAccessSecret) as UserPayload;
    } catch(err)    {
        throw new Error("Access Token 검증 실패");
    }
}

// 리프레시 토큰 검증(성공시 UserPayload 타입으로 반환)
export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, jwtRefreshSecret) as UserPayload;
    } catch(err)    {
        throw new Error("Access Token 검증 실패");
    }
}
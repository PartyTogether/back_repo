import jwt from "jsonwebtoken";
import {UserPayload} from "../types/discorduser";

const jwtAccessSecret: string = process.env.JWT_ACCESS_SECRET!;
const jwtRefreshSecret: string = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (user: UserPayload): string => {
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

export const generateRefreshToken = (user: UserPayload): string => {
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
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            throw new Error('토큰이 만료되었습니다.');
        } else if (err instanceof jwt.JsonWebTokenError) {
            throw new Error('유효하지 않은 토큰입니다.');
        } else {
            throw err;
        }
    }
}

// 리프레시 토큰 검증(성공시 UserPayload 타입으로 반환)
export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, jwtRefreshSecret) as UserPayload;
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            throw new Error('토큰이 만료되었습니다.');
        } else if (err instanceof jwt.JsonWebTokenError) {
            throw new Error('유효하지 않은 토큰입니다.');
        } else {
            throw err;
        }
    }
}
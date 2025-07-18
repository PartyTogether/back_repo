import jwt from "jsonwebtoken";
import { MemberInfo } from "../types/discord-member";

const jwtAccessSecret: string = process.env.JWT_ACCESS_SECRET!;
const jwtRefreshSecret: string = process.env.JWT_REFRESH_SECRET!;

let payload:MemberInfo;

export const generateAccessToken = (member: MemberInfo): string => {
    payload = { id: member.id,
        username: member.username,
        email: member.email }
    return jwt.sign(
        payload ,
        jwtAccessSecret ,
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (member: MemberInfo): string => {
    payload = { id: member.id,
        username: member.username,
        email: member.email }
    return jwt.sign(
        payload,
        jwtRefreshSecret,
        { expiresIn: '7d' }
    );
};

// 엑세스 토큰 검증(성공시 MemberInfo 타입으로 반환)
export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, jwtAccessSecret) as MemberInfo;
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

// 리프레시 토큰 검증(성공시 MemberInfo 타입으로 반환)
export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, jwtRefreshSecret) as MemberInfo;
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
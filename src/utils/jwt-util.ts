import jwt from "jsonwebtoken";
import { MemberInfo } from "../types/discord-member";

const jwtAccessSecret: string = process.env.JWT_ACCESS_SECRET!;
const jwtRefreshSecret: string = process.env.JWT_REFRESH_SECRET!;

let payload:MemberInfo;

export const generateAccessToken = (member: MemberInfo): string => {
    payload = { id: member.id,
        username: member.username
    }
    return jwt.sign(
        payload ,
        jwtAccessSecret ,
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (member: MemberInfo): string => {
    payload = { id: member.id,
        username: member.username
    }
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
        throw err;
    }
}

// 리프레시 토큰 검증(성공시 MemberInfo 타입으로 반환)
export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, jwtRefreshSecret) as MemberInfo;
    } catch (err) {
        throw err;
    }
}
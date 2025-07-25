import jwt from "jsonwebtoken";
import { MemberInfo } from "../types/discord-member";
import { getRedisClient } from "../config/redis";

const JWT_ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET!;
const JWT_ACCESS_EXPIRE: number = Number(process.env.JWT_ACCESS_EXPIRE)!;
const JWT_REFRESH_EXPIRE: number = Number(process.env.JWT_REFRESH_EXPIRE)!;

let payload:MemberInfo;

export const generateAccessToken = (member: MemberInfo): string => {
    payload = { id: member.id,
        username: member.username
    }
    return jwt.sign(
        payload ,
        JWT_ACCESS_SECRET ,
        { expiresIn: JWT_ACCESS_EXPIRE }
    );
};

export const generateRefreshToken = (member: MemberInfo): string => {
    payload = { id: member.id,
        username: member.username
    }
    return jwt.sign(
        payload,
        JWT_REFRESH_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRE }
    );
};

// 엑세스 토큰 검증(성공시 MemberInfo 타입으로 반환)
export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_ACCESS_SECRET) as MemberInfo;
    } catch (err) {
        throw err;
    }
};

// 리프레시 토큰 검증(성공시 MemberInfo 타입으로 반환)
export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as MemberInfo;
    } catch (err) {
        throw err;
    }
};

// Redis에 RefreshToken SAVE
export const saveRefreshTokenInRedis = async (userId: string, token: string) => {
    const client = await getRedisClient();
    await client.set(`refresh:${userId}`, token, { EX : JWT_REFRESH_EXPIRE });
};

// Redis에 있는 RefreshToken GET
export const getRefreshTokenInRedis = async (userId: string): Promise<String | null> => {
    const client = await getRedisClient();
    return await client.get(`refresh:${userId}`);
};

// Redis에 있는 RefreshToken DELETE
export const deleteRefreshTokenInRedis = async (userId: string)=> {
    const client = await getRedisClient();
    return await client.del(`refresh:${userId}`);
};
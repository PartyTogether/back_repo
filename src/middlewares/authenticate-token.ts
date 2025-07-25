import { Request, Response, NextFunction } from "express";
import {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken} from "../utils/jwt-util";
import {MemberInfo} from "../types/discord-member";
import {AppDataSource} from "../data-source";
import {Member} from "../models/entities/member";
import jwt from "jsonwebtoken";

// 사용자 토큰을 검증하고 성공 시 Token의 Payload를 req.user에 적용
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    // 토큰 없을 시
    if (!accessToken || !refreshToken) {
        return res.status(411).json({ message: "Token이 없습니다." });
    }

    try {
        // 토큰에 있는 Payload의 정보를 반환
        const getMemberByToken: MemberInfo = verifyAccessToken(accessToken);
        
        // DB 에서 discord_id를 통해 해당 유저 정보 존재 유무 파악
        const isExist = await AppDataSource.getRepository(Member).exists({
            where : { discord_id : getMemberByToken.id }
        });

        // 해당 유저가 존재하는지 확인
        if(!isExist)    {
            return res.status(403).json({ message : "유저가 존재하지 않습니다." });
        }

        // 다음 MiddleWare에서 요청 Member의 정보를 사용할 수 있도록 정보 저장
        req.member = getMemberByToken;
        next();
    } catch (err) {
        // AccessToken이 만료되서 예외처리가 될 경우
        if(err instanceof jwt.TokenExpiredError)    {
            return res.status(408).json({ message : "AccessToken이 만료되었습니다. "});
        }
    }
};
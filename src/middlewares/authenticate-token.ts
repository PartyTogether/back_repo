import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt-util";
import {MemberInfo} from "../types/discord-member";
import {AppDataSource} from "../data-source";
import {Member} from "../models/entities/member";

// 사용자 토큰을 검증하고 성공 시 Token의 Payload를 req.user에 적용
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    // 토큰 없을 시
    if (!token) {
        res.status(411).json({ message: "Access Token이 없습니다." });
    }

    try {
        // 토큰에 있는 Payload의 정보를 반환
        const getMemberByToken: MemberInfo = verifyAccessToken(token);
        
        // DB 에서 discord_id를 통해 해당 유저 정보 존재 유무 파악
        const isExist = await AppDataSource.getRepository(Member).exists({
            where : { discord_id : getMemberByToken.id }
        });

        // 해당 유저가 존재하는지 확인
        if(!isExist)    {
            res.status(403).json({ message : "유저가 존재하지 않습니다." });
        }

        // 다음 MiddleWare에서 요청 Member의 정보를 사용할 수 있도록 정보 저장
        req.member = getMemberByToken;
        next();
    } catch (err) {
        res.status(403).json({ message: "유효하지 않은 Access Token입니다." });
    }
};
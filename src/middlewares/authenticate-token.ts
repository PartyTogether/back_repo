import {NextFunction, Request, Response} from "express";
import {saveRefreshTokenInRedis, verifyAccessToken} from "../utils/jwt-util";
import {MemberInfo} from "../types/discord-member";
import {AppDataSource} from "../data-source";
import {Member} from "../models/entities/member";
import jwt from "jsonwebtoken";
import {generateNewTokens} from "../services/auth-service";

// 사용자 토큰을 검증하고 성공 시 Token의 Payload를 req.user에 적용
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    // 토큰 없을 시
    if (!accessToken || !refreshToken) {
        res.status(401).json({ message: "Token이 없습니다." });
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
            res.status(403).json({ message : "유저가 존재하지 않습니다." });
        }

        // 다음 MiddleWare에서 요청 Member의 정보를 사용할 수 있도록 정보 저장
        req.member = getMemberByToken;
        next();
    } catch (err) {
        // AccessToken이 만료되서 예외처리가 될 경우
        console.log("Token Err? : ", err);

        if(err instanceof jwt.TokenExpiredError)    {
            console.log("토큰 만료됨");

            try {
                const {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                    member
                } = await generateNewTokens(refreshToken);

                req.cookies.access_token = newAccessToken;
                req.cookies.refresh_token = newRefreshToken;

                const newMember: MemberInfo = verifyAccessToken(newAccessToken);
                req.member = member;

                // redis에 RefreshToken 저장
                await saveRefreshTokenInRedis(newMember.id, refreshToken);

                next();
            } catch (refreshErr)   {
                console.log("RefreshErr : ", refreshErr);
                res.status(401).json({ message : "유효하지 않은 토큰입니다 -> " + refreshErr });
                res.clearCookie("access_token", { httpOnly: true, secure: true, sameSite: "strict" });
                res.clearCookie("refresh_token", { httpOnly: true, secure: true, sameSite: "strict" });
                res.redirect(process.env.BASE_URL!);
            }
        }
    }
};
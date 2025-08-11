import {NextFunction, Request, Response} from "express";
import {verifyAccessToken} from "../utils/jwt-util";
import {MemberInfo} from "../types/discord-member";
import {AppDataSource} from "../data-source";
import {Member} from "../models/entities/member";

export const optionalAuthenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
        return next();
    }

    try {
        const memberInfo: MemberInfo = verifyAccessToken(accessToken);
        const memberExists = await AppDataSource.getRepository(Member).exists({
            where: { discord_id: memberInfo.id }
        });
        if (memberExists) {
            req.member = memberInfo;
        }
    } catch (err) {
    }
    return next();
};
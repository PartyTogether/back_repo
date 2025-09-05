import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
    getAuthTokens,
    getDiscordLoginUrl,
    getDiscordMember,
    getDiscordToken
} from "../services/auth-service";
import {MemberInfo} from "../types/discord-member";
import {deleteRefreshTokenInRedis} from "../utils/jwt-util";
import {getMemberById, update} from "../services/member-service";
import {getSkillsByJob} from "../services/skill-service";
import {SkillGetRes} from "../dto/skill-get-res";


const app = express();

// 직업에 따른 스킬 Get 요청
export const getSkills = async (req: Request, res: Response) => {
    const skills = await getSkillsByJob(req);
    res.status(200).json(skills);
}
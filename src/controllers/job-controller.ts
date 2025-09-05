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
import {getAllJob} from "../services/job-service";


const app = express();

// 직업 Get 요청
export const getJobs = async (req: Request, res: Response) => {
    const jobs = await getAllJob();
    res.status(200).json(jobs);
}
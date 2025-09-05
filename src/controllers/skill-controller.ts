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
import {validate, ValidationError} from "class-validator";
import {plainToInstance} from "class-transformer";
import {MemberUpdateReq} from "../dto/member-update-req";
import {ClientError} from "../error/client-error";
import {SkillGetReq} from "../dto/skill-get-req";


const app = express();

const getErrorMessages = (errors: ValidationError[]): string[] => {
    let messages: string[] = [];
    for (const error of errors) {
        if (error.constraints) {
            messages = messages.concat(Object.values(error.constraints));
        }
        if (error.children && error.children.length > 0) {
            messages = messages.concat(getErrorMessages(error.children));
        }
    }
    return messages;
};

// 직업에 따른 스킬 Get 요청
export const getSkills = async (req: Request, res: Response) => {
    console.log("Request : ", req.query);
    try {
        const reqBody = plainToInstance(SkillGetReq, req.query);
        const errors = await validate(reqBody);
        if (errors.length > 0) {
            const errorMessages = getErrorMessages(errors);
            throw new ClientError(400,errorMessages.join(', '));
        }
    } catch (err) {
        throw new ClientError(500, "Request Validation 진행중 에러발생 : " + err);
    }
    const skills = await getSkillsByJob(req);
    res.status(200).json(skills);
}
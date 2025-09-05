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
import {plainToInstance} from "class-transformer";
import {RoomCreateReq} from "../dto/room-create-req";
import {validate, ValidationError} from "class-validator";
import {ClientError} from "../error/client-error";
import {MemberUpdateReq} from "../dto/member-update-req";


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

// 디스코드 로그인 요청
export const discordLogin = (req: Request, res: Response) => {
    const discordUrl = getDiscordLoginUrl();
    res.redirect(discordUrl);
}

// 디스코드 로그인 성공 후 처리까지
export const discordCallback = asyncHandler(async (req: Request, res: Response) => {
    console.log("discordCallback");
    const code = req.query.code as string | undefined;

    if(!code)   {
        res.redirect(process.env.BASE_URL!);
        return;
    }
    
    // Discord 멤버 정보를 요청하기 위한 토큰 발급
    const token: string = await getDiscordToken(code);

    // Discord에서 발급한 유저 정보
    const member: MemberInfo = await getDiscordMember(token);

    try {
        const { accessToken, refreshToken } = await getAuthTokens(member);

        // ✅ 쿠키에 JWT 저장 (HttpOnly 설정)
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.cookie('auth_status', true, {
            httpOnly: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        console.log("발급된 access_token : ", accessToken);
        console.log("발급된 refresh_token : ", refreshToken);

        // 로그인 성공 후 리다이렉트
        res.redirect(process.env.BASE_URL!);
    } catch (error) {
        console.error("Discord 인증 실패 : ", error);
        res.status(500).json("Discord 인증 실패");
    }
});

export const authMe = (req: Request, res: Response) => {
    console.log("클라이언트 식별 요청 : ", req.member);
    if(req.member)  {
        res.status(200).json(req.member);
    }
}

export const authLogout  = async (req: Request, res: Response) => {
    console.log("로그아웃 실행");
    try {
        res.clearCookie(process.env.ACCESS_TOKEN!);
        res.clearCookie(process.env.REFRESH_TOKEN!);
        res.clearCookie(process.env.AUTH_STATUS!);

        await deleteRefreshTokenInRedis(req.member.id);

        res.status(200).json({ message : "로그아웃에 성공하였습니다!" });
    } catch(err)    {
        res.status(500).json({ message : "로그아웃에 실패하였습니다. " });
    }
};

export const getMember = async(req: Request, res: Response) => {
    console.log("유저 정보 가져오기 실행");
    try {
        const memberInfo = await getMemberById(req);
        console.log("memberInfo : ", memberInfo);
        res.status(200).json({ member : memberInfo });
    } catch(err)    {
        console.log("err : ", err);
        res.status(500).json({ message : "유저 정보 가져오기 오류 발생" });
    }
}

export const updateMember = async(req: Request, res: Response) => {
    console.log("유저 업데이트 실행");
    try {
        const reqBody = plainToInstance(MemberUpdateReq, req.body);
        const errors = await validate(reqBody);
        if (errors.length > 0) {
            const errorMessages = getErrorMessages(errors);
            throw new ClientError(400,errorMessages.join(', '));
        }
    } catch (err) {
        throw new ClientError(500, "Request Validation 진행중 에러발생 : " + err);
    }

    try {
        const updatedMemberInfo = await update(req);
        res.status(200).json({ member : updatedMemberInfo });
    } catch(err)    {
        res.status(500).json({ message : "유저 정보 업데이트 실패"});
    }
}
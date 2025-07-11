import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {getAuthTokens, getDiscordLoginUrl } from "../service/authService";

const app = express();

// 디스코드 로그인 요청
export const discordLogin = (req: Request, res: Response) => {
    const discordUrl = getDiscordLoginUrl();
    res.redirect(discordUrl);
}

// 디스코드 로그인 성공 후 처리까지
export const discordCallback = asyncHandler(async (req: Request, res: Response) => {
    const code = req.query.code as string | undefined;

    if(!code)   {
        res.status(400).send("코드가 없습니다.");
        return;
    }

    try {
        const { accessToken, refreshToken } = await getAuthTokens(code);

        // ✅ 쿠키에 JWT 저장 (HttpOnly 설정)
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        console.log("발급된 access_token : ", accessToken);
        console.log("발급된 refresh_token : ", refreshToken);

        // 로그인 성공 후 리다이렉트
        res.redirect('http://localhost:3000');
    } catch (error) {
        console.error("Discord 인증 실패 : ", error);
        res.status(500).send("Discord 인증 실패");
    }
});
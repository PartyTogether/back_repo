import express, {Request, Response} from "express";
import asyncHandler from "express-async-handler";
import axios from "axios";
import session from "express-session";

const router = express.Router();

declare module 'express-session' {
    interface SessionData {
        user?: {
            id: string;
            username: string;
            email?: string;
        };
    }
}

router.use(session({
    //TODO secret은 추후 환경 변수로 설정해야함
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

console.log('clientID:', process.env.CLIENT_ID);
console.log('clientSecret:', process.env.CLIENT_SECRET);
console.log('redirectUri:', process.env.REDIRECT_URI);

// Undefined가 아니라는걸 알려줘야하기때문에 !를 맨뒤에 붙임
const clientID: string = process.env.CLIENT_ID!;
const clientSecret: string = process.env.CLIENT_SECRET!;
const redirectUri: string = process.env.REDIRECT_URI!;

router.get('/discord', (req:Request, res:Response) => {
    const scope: string = encodeURIComponent('identify email');
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
    res.redirect(discordAuthUrl);
})

router.get('/discord/callback', asyncHandler(async (req, res) => {
    const code = req.query.code as string | undefined;

    if(!code)   {
        res.status(400).send("코드가 없습니다.");
        return;
    }

    try {
        // 토큰 Request 바디 타입 지정
        const params = new URLSearchParams({
            client_id: clientID,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            scope: 'identify email',
        });

        // Discord에 액세스 토큰 요청
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const accessToken = tokenResponse.data.access_token as string;

        // 사용자 정보 요청 타입 정의
        interface DiscordUser {
            id: string;
            username: string;
            discriminator: string;
            avatar: string | null;
            email?: string;
            verified?: boolean;
            locale?: string;
            mfa_enabled?: boolean;
        }

        // Discord API에서 사용자 정보 요청
        const userResponse = await axios.get<DiscordUser>('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        // 세션에 사용자 정보 저장 (Express.Session 타입 확장 필요)
        req.session.user = userResponse.data

        // 로그인 성공 후 리다이렉트
        res.redirect('/');
    } catch (error) {
        console.error("Discord 인증 실패 : ", error);
        res.status(500).send("Discord 인증 실패");
    }
}));

export default router;
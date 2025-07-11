import axios from "axios";
import { DiscordUser } from "../types/discorduser";
import {generateAccessToken, generateRefreshToken} from "../utils/jwtutil";

const clientID = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;
const redirectUri = process.env.REDIRECT_URI!;

export const getDiscordLoginUrl = (): string => {
    const scope = encodeURIComponent("identify email");
    return `https://discord.com/api/oauth2/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(
        redirectUri,
    )}&response_type=code&scope=${scope}`;
};

export const getAuthTokens = async (code: string) => {

    // 디스코드에서 발급한 토큰
    const token: string = await getDiscordToken(code);

    // Discord에서 발급한 유저 정보
    const user = await getDiscordUser(token);

    // 유저 정보를 Token payload에 넣어 저장
    const accessToken: string = generateAccessToken(user);
    const refreshToken: string = generateRefreshToken(user);

    return { accessToken, refreshToken };
};

// 디스코드에서 토큰 발급받기
export const getDiscordToken = async (code: string) => {
    const params = new URLSearchParams({
        client_id: clientID,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        scope: 'identify email',
    });

    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

   return tokenResponse.data.access_token;
}

// 디스코드에서 발급한 토큰으로 유저 정보 가져오기
export const getDiscordUser = async (token: string) => {
    const userResponse = await axios.get<DiscordUser>('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` },
    });

    return userResponse.data;
}
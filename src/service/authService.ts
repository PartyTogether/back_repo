import axios from "axios";
import {DiscordUser, UserPayload} from "../types/discorduser";
import jwt from "jsonwebtoken";
import {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken} from "../utils/jwtutil";

const clientID = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;
const redirectUri = process.env.REDIRECT_URI!;

// 디스코드 로그인 요청
export const getDiscordLoginUrl = (): string => {
    const scope = encodeURIComponent("identify email");
    return `https://discord.com/api/oauth2/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(
        redirectUri,
    )}&response_type=code&scope=${scope}`;
};

// 토큰 발급 및 반환
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

    const data = userResponse.data;
    const user: UserPayload = { id: data.id, username: data.username, email: data.email }
    return user;
}

// AccessToken 만료시 RefreshToken 으로 재발급
export const generateNewTokens = (accessToken: string, refreshToken: string) => {
    try {
        const user = verifyAccessToken(accessToken);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    } catch (err)   {
        // 만료 여부 체크
        if (err instanceof jwt.TokenExpiredError) {
            // AccessToken 만료 → RefreshToken 검증 및 재발급 진행
            try {
                const user = verifyRefreshToken(refreshToken);
                // 재발급
                const newAccessToken = generateAccessToken(user);
                const newRefreshToken = generateRefreshToken(user);
                return {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                };
            } catch (refreshErr) {
                // RefreshToken도 유효하지 않을 경우
                throw new Error("Refresh Token이 유효하지 않습니다. 다시 로그인하세요.");
            }
        } else {
            // AccessToken이 만료된 게 아니라 다른 오류
            throw err;
        }
    }
}
// 디스코드 로그인 유저 타입
export interface DiscordMember {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    email?: string;
    verified?: boolean;
    locale?: string;
    mfa_enabled?: boolean;
}

// 토큰에 저장되는 유저정보
export interface MemberInfo {
    id: string;
    username: string;
    email?: string;
}
// 디스코드 로그인 유저 타입
export interface DiscordMember {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    public_flags: string;
    flags: string;
    mfa_enabled?: boolean;
    verified?: boolean;
    email?: string;
    locale: string;
}

// 토큰에 저장되는 유저정보
export interface MemberInfo {
    id: string;
    username: string;
}
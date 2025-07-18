import {DiscordMember} from "../types/discord-member";
import {Member} from "../models/entities/member";

// 디스코드 요청으로부터 받아온 유저 데이터를 Metu플랫폼에 대한 유저 정보로 변환
export const createMemberFromDiscordMember = (discordMember: DiscordMember): Member =>  {
    return Object.assign(new Member(), {
        discord_id:discordMember.id,
        username:discordMember.username,
        avatar: discordMember.avatar ?? '',
        discriminator: discordMember.discriminator,
        public_flags: Number(discordMember.public_flags ?? 0),
        flags: Number(discordMember.flags ?? 0),
        mfa_enabled: discordMember.mfa_enabled ?? false,
        verified: discordMember.verified ?? false,
    });
}
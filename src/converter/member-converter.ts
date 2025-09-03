import {DiscordMember} from "../types/discord-member";
import {Member} from "../models/entities/member";
import {MemberUpdateReq} from "../dto/member-update-req";

export const memberToDto = (member: Member): MemberUpdateReq =>  {
    return Object.assign(new MemberUpdateReq, {
        discord_id:discordMember.id,
        username:discordMember.username,
        globalName: discordMember.global_name,
        avatar: discordMember.avatar ?? '',
        discriminator: discordMember.discriminator,
        public_flags: Number(discordMember.public_flags ?? 0),
        flags: Number(discordMember.flags ?? 0),
        mfa_enabled: discordMember.mfa_enabled ?? false,
        verified: discordMember.verified ?? false,
    });
}
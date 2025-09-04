import {MemberGetSkill} from "./member-get-skill";

export interface MemberUpdateReq {
    level: number | null,
    nickName: string | null,
    job: string | null,
    offerComment: string | null,
    skill: MemberGetSkill[]
}
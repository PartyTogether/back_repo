import {MemberGetSkill} from "./member-get-skill";

export interface MemberUpdateRes {
    level: number | null,
    nickName: string | null,
    job: string | null,
    offerComment: string | null,
    skill: MemberGetSkill[]
}
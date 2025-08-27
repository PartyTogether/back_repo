import {MemberGetSkill} from "./member-get-skill";


export interface MemberGetRes {
    offerComment: string | null,
    level: number | null,
    nickName: string | null,
    job: string | null,
    skill: MemberGetSkill[]
}
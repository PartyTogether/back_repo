import {Request} from "express";
import {AppDataSource} from "../data-source";
import {memberRepository} from "../repositories/member-repository";
import {ClientError} from "../error/client-error";
import {MemberGetRes} from "../dto/member-get-res";
import {jobRepository} from "../repositories/job-repository";
import {memberSkillRepository} from "../repositories/member-skill-repository";
import {MemberUpdateReq} from "../dto/member-update-req";
import {MemberGetSkill} from "../dto/member-get-skill";
import {Member} from "../models/entities/member";
import {MemberUpdateRes} from "../dto/member-update-res";
import {Skill} from "../models/entities/skill";
import {MemberSkill} from "../models/entities/member-skill";
import {skillRepository} from "../repositories/skill-repository";
import {SkillGetRes} from "../dto/skill-get-res";


export const getSkillsByJob = async (req: Request):Promise<SkillGetRes[]> => {
    const discordId = req.member.id;

    if(!discordId)  {
        throw new ClientError(403, "사용자 정보 요청이 유효하지 않습니다.");
    }

    return await AppDataSource.transaction(async (transactionalEntityManager) => {
        const skillRepo = transactionalEntityManager.withRepository(skillRepository);

        const getSkillByJob = await skillRepo.find({ where : { job : req.body.job }});

        return getSkillByJob.map(skill => ({
            name: skill.name,
            image: skill.image,
            masterLevel: skill.masterLevel
        }));
    });
}
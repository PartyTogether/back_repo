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


export const getMemberById = async (req: Request): Promise<MemberGetRes> => {
    const discordId = req.member.id;

    if(!discordId)  {
        throw new ClientError(403, "사용자 정보 요청이 유효하지 않습니다.");
    }
    
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
        const memberRepo = transactionalEntityManager.withRepository(memberRepository);
        const jobRepo = transactionalEntityManager.withRepository(jobRepository);
        const memberSkillRepo = transactionalEntityManager.withRepository(memberSkillRepository);

        const getMember = await memberRepo.findOne({ where: { discord_id: discordId }});

        if(!getMember) {
            throw new ClientError(403, "해당하는 유저가 존재하지 않습니다.");
        }
        
        //TODO 유저가 등록한 스킬 레벨 및 직업 반환 추가해야함
        const getJobByMember = await jobRepo.findOne({ where : { members: getMember}});
        const getSkillsByMember = await memberSkillRepo.find({
            where: { member: getMember! },
            relations: ["skill"]
        });

        return {
            offerComment: getMember.offer_comment,
            level: getMember.level,
            nickName: getMember.nickname,
            job: getJobByMember?.name ?? null,
            skill: getSkillsByMember.map(ms => ({
                name: ms.skill.name,
                masterLevel: ms.skill.masterLevel,
                image: ms.skill.image,
                level: ms.level
            }))
        }
    });
}


export const getMemberIdService = async(discordId: string) => {
    const member = await memberRepository.findOne({ where: { discord_id:discordId }});
    if(!member){
        throw new ClientError(404,"해당 유저를 찾을 수 없습니다.");
    }
    return {
        memberId: member.id,
    }
}

export const update = async (req: Request): Promise<void> => {
    const discordId = req.member.id;

    if(!discordId)  {
        throw new ClientError(403, "사용자 정보 요청이 유효하지 않습니다.");
    }

    const { level, nickName, job, offerComment, skill }: MemberUpdateReq = req.body;

    return await AppDataSource.transaction(async (transactionalEntityManager) => {
        const memberRepo = transactionalEntityManager.withRepository(memberRepository);
        const getMember = await memberRepo.findOne({
            where : {discord_id : discordId },
            relations : ["skill"]
        });

        if(!getMember)  {
            throw new ClientError(403, "존재하는 사용자가 아닙니다.");
        }

        getMember.level = level;
        getMember.nickname = nickName;
        getMember.job = job;
        getMember.offer_comment = offerComment;

        // 스킬 업데이트
        if (skill && Array.isArray(skill)) {
            // 아니면 매핑해서 업데이트할 수도 있음 → 여기서는 교체 예시
            getMember.memberSkills = skill.map((s: MemberGetSkill) => {
                return transactionalEntityManager.create("Skill", {
                    name: s.name,
                    masterLevel: s.masterLevel,
                    image: s.image,
                    level: s.level,
                });
            });
        }

        await memberRepo.save(getMember);
    });
}


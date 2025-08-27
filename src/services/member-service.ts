import {Request} from "express";
import {AppDataSource} from "../data-source";
import {memberRepository} from "../repositories/member-repository";
import {ClientError} from "../error/client-error";
import {MemberGetRes} from "../dto/member-get-res";
import {jobRepository} from "../repositories/job-repository";
import {memberSkillRepository} from "../repositories/member-skill-repository";


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
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


export const getMemberById = async (req: Request): Promise<MemberGetRes> => {
    const discordId = req.member.id;

    if(!discordId)  {
        throw new ClientError(403, "사용자 정보 요청이 유효하지 않습니다.");
    }

    return await AppDataSource.transaction(async (transactionalEntityManager): Promise<MemberGetRes> => {
        const memberRepo = transactionalEntityManager.withRepository(memberRepository);
        const memberSkillRepo = transactionalEntityManager.withRepository(memberSkillRepository);
        const jobRepo = transactionalEntityManager.withRepository(jobRepository);

        const getMember = await memberRepo.findOne({
            where: { discord_id: discordId }
        });

        if(!getMember) {
            throw new ClientError(403, "해당하는 유저가 존재하지 않습니다.");
        }

        const memberJob= await jobRepo.findOne({
            where : { members: getMember }
        });

        const getMemberSkill = await memberSkillRepo.find({
            where : { member: { id: getMember.id } },
            relations: ["skill"]
        });

        const memberGetSkills: MemberGetSkill[] = getMemberSkill.map(ms => ({
            name: ms.skill.name,          // Skill 엔티티의 name
            level: ms.level,               // MemberSkill의 level
            masterLevel: ms.skill.masterLevel, // Skill 엔티티의 masterLevel
            image: ms.skill.image || null  // Skill 엔티티의 image
        }));

        console.log("getMember : ", getMember);
        console.log("memberGetSkills : ", memberGetSkills);

        return {
            offerComment : getMember.offer_comment,
            level: getMember.level,
            nickName: getMember.nickname,
            job: memberJob?.name || '초보자',
            skill: memberGetSkills
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
    const reqData = req.body;
    const discordId = req.member.id;

    if(!discordId)  {
        throw new ClientError(403, "사용자 정보 요청이 유효하지 않습니다.");
    }

    return await AppDataSource.transaction(async (transactionalEntityManager) => {
        const memberRepo = transactionalEntityManager.withRepository(memberRepository);
        const skillRepo = transactionalEntityManager.withRepository(skillRepository);
        const memberSkillRepo = transactionalEntityManager.withRepository(memberSkillRepository);
        const jobRepo = transactionalEntityManager.withRepository(jobRepository);

        // 멤버 조회 (기존 스킬 포함)
        const getMember = await memberRepo.findOne({
            where: { discord_id: discordId },
            relations: ["memberSkills", "memberSkills.skill", "job"],
        });

        if (!getMember) {
            throw new ClientError(404, "존재하지 않는 사용자입니다.");
        }

        // 멤버 기본 정보 업데이트
        getMember.level = reqData.level;
        getMember.nickname = reqData.nickName;
        getMember.offer_comment = reqData.offerComment;

        console.log("reqData.job.name : ", reqData.job);

        // 직업이 변경된 경우
        if (getMember.job && reqData.job) {
            const jobInfo = await jobRepo.findOne({
                where: { name : reqData.job }
            });
            console.log("jobInfo : ", jobInfo);
            getMember.job = jobInfo!;
        }

        // 저장
        await memberRepo.save(getMember);

        // 기존 MemberSkill 삭제
        if (getMember.memberSkills.length > 0) {
            const memberSkillIds = getMember.memberSkills.map((ms) => ms.id);
            await memberSkillRepo.delete(memberSkillIds);
        }

        // 새로운 MemberSkill 생성
        if (req.body.skill && Array.isArray(req.body.skill)) {
            for (const s of req.body.skill) {
                // Skill 엔티티 먼저 조회
                let skillEntity = await skillRepo.findOne({ where: { name: s.name } });

                // Skill 엔티티가 없으면 새로 생성
                if (!skillEntity) {
                    skillEntity = skillRepo.create({
                        name: s.name,
                        masterLevel: s.masterLevel,
                        image: s.image || null,
                        job: getMember.job,
                    });
                    await skillRepo.save(skillEntity);
                }

                // MemberSkill 생성
                const memberSkill = memberSkillRepo.create({
                    member: getMember,
                    skill: skillEntity,
                    level: s.level,
                });

                await memberSkillRepo.save(memberSkill);
            }
        }
        console.log("✅ 멤버 정보 및 스킬 업데이트 완료");
    });
}

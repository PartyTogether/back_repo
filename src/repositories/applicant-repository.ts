import { AppDataSource } from '../data-source';
import { Applicant } from '../models/entities/applicant';
import {ApplicantRes, memberSkill} from '../dto/applicant-res';

export const applicantRepository = AppDataSource.getRepository(Applicant).extend({
    async findApplicantsByRoomId(roomId: string):Promise<ApplicantRes[]> {
        const result = await this.createQueryBuilder('applicant')
            .leftJoinAndSelect('applicant.member', 'member')
            .leftJoinAndSelect('member.job', 'job')
            .leftJoinAndSelect('member.memberSkills', 'memberSkill')
            .leftJoinAndSelect('memberSkill.skill', 'skill')
            .innerJoinAndSelect('applicant.roomPosition', 'roomPosition')
            .innerJoin('roomPosition.room', 'room')
            .where('room.id = :roomId', { roomId })
            .getMany();

        return result.map(r => ({
            applicantId: r.id,
            memberId: r.member.id,
            memberName: r.member.nickname || r.member.globalName,
            memberLevel: r.member.level || null,
            memberClass: r.member.job.name,
            positionName: r.roomPosition.name,
            memberSkills: r.member.memberSkills.map(ms => ({
                skillName: ms.skill.name,
                skillImage: ms.skill.image || null,
                memberSkillLevel: ms.level
            }))
        }));
    },

    async findApplicantsByMemberId(memberId: string): Promise<Applicant[]> {
        return this.createQueryBuilder('applicant')
            .leftJoinAndSelect('applicant.roomPosition', 'roomPosition')
            .leftJoinAndSelect('roomPosition.room', 'room')
            .where('applicant.member.id = :memberId', { memberId })
            .getMany();
    }
});

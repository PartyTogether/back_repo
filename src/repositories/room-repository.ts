import { AppDataSource } from "../data-source";
import { Room } from "../models/entities/room";
import {selectedRoom} from "../dto/room-me-res";

export const roomRepository = AppDataSource.getRepository(Room).extend({
    async findRoomsByContinentOrHuntingGround(continent:string,huntingGround:string) {
        const query = this.createQueryBuilder('room')
            .innerJoinAndSelect('room.huntingGround', 'huntingGround')
            .innerJoinAndSelect('huntingGround.continent', 'continent')
            .innerJoinAndSelect('room.host', 'host')
            .leftJoin('room.members', 'member')
            .addSelect('COUNT(member.id)', 'currentMemberCount')
            .groupBy('room.id')
            .addGroupBy('huntingGround.id')
            .addGroupBy('continent.id')
            .addGroupBy('host.id');

        if(huntingGround && huntingGround.trim() !== '') {
            query.where('huntingGround.name = :huntingGround', { huntingGround });
        } else {
            query.where('continent.name = :continent', { continent });
        }

        query.orderBy('CASE WHEN COUNT(member.id) >= room.maxMembers THEN 1 ELSE 0 END', 'ASC')
            .addOrderBy('room.createdAt', 'DESC');

        const { entities, raw } = await query.getRawAndEntities();

        entities.forEach((room, i) => {
            room.currentMemberCount = Number(raw[i].currentMemberCount);
        });

        return entities;
    },
    async findMyRoom(memberId: string): Promise<selectedRoom | null> {
        const room = await this.createQueryBuilder('room')
            .distinct(true)
            .select([
                'room.id',
                'room.title',
                'room.desc',
                'room.maxMembers',
                'room.channel',
                'room.minLevel',
                'room.minTime',
                'host.id',
                'members.id',
                'members.nickname',
                'members.globalName',
                'members.level',
                'job.id',
                'job.name',
                'memberSkills.level',
                'skill.name',
                'skill.image',
                'roomPositions.id',
                'roomPositions.name',
                'roomPositions.status',
                'roomPositions.comment',
                'positionMember.id',
                'positionMember.nickname',
                'positionMember.globalName',
                'positionMember.level',
                'positionMemberJob.id',
                'positionMemberJob.name',
                'positionMemberSkills.level',
                'positionSkill.name',
                'positionSkill.image',
            ])
            .innerJoin('room.members', 'member')
            .where('member.id = :memberId', { memberId })
            .innerJoin('room.host', 'host')
            .leftJoin('room.members', 'members')
            .leftJoin('members.job', 'job')
            .leftJoin('members.memberSkills', 'memberSkills')
            .leftJoin('memberSkills.skill', 'skill')
            .leftJoin('room.roomPositions', 'roomPositions')
            .leftJoin('roomPositions.member', 'positionMember')
            .leftJoin('positionMember.job', 'positionMemberJob')
            .leftJoin('positionMember.memberSkills', 'positionMemberSkills')
            .leftJoin('positionMemberSkills.skill', 'positionSkill')
            .getOne();

        if(!room) return null;

        return{
            roomId: room.id,
            roomTitle: room.title,
            roomDesc: room.desc || null,
            roomCurrentMembers: room.members?.length || 0,
            roomMaxMembers: room.maxMembers,
            roomChannel: room.channel || null,
            roomMinLevel:  room.minLevel,
            roomMinTime: room.minTime,
            roomHost: room.host.id,
            roomMembers: room.members?.map(m => ({
                memberId: m.id,
                memberName: m.nickname || m.globalName,
                memberLevel: m.level || null,
                memberClass: m.job?.name || '',
                memberSkills: m.memberSkills?.map(ms => ({
                    skillName: ms.skill?.name || '',
                    skillImage: ms.skill.image || '',
                    memberSkillLevel: ms.level,
                })) || [],
            })) || [],
            roomPositions: room.roomPositions?.map(rp => ({
                positionName: rp.name,
                positionStatus: rp.status,
                positionComment: rp.comment,
                member: rp.member ? {
                    memberId: rp.member.id,
                    memberName: rp.member.nickname || rp.member.globalName,
                    memberLevel: rp.member.level || null,
                    memberClass: rp.member.job?.name || '',
                    memberSkills: rp.member.memberSkills?.map(ms => ({
                        skillName: ms.skill?.name || '',
                        skillImage: ms.skill?.image || '',
                        memberSkillLevel: ms.level,
                    })) || [],
                } : null,
            })) || [],
        }

    }
});

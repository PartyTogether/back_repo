import { AppDataSource } from "../data-source";
import { Room } from "../models/entities/room";
import {selectedRoom} from "../dto/room-me-res";

export const roomRepository = AppDataSource.getRepository(Room).extend({
    async findRoomsByContinentOrHuntingGround(continent:string,huntingGround:string) {
        const query = this.createQueryBuilder('room')
            .innerJoinAndSelect('room.huntingGround', 'huntingGround')
            .innerJoinAndSelect('huntingGround.continent', 'continent')
            .innerJoinAndSelect('room.host', 'host')
            .leftJoin('room.roomPositions', 'roomPosition')
            .leftJoin('roomPosition.member', 'member')
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
            .innerJoin('room.roomPositions', 'activePosition', 'activePosition.member = :memberId', { memberId })
            .innerJoinAndSelect('room.host', 'host')
            .leftJoinAndSelect('room.roomPositions', 'roomPositions')
            .leftJoinAndSelect('roomPositions.member', 'positionMember')
            .leftJoinAndSelect('positionMember.job', 'job')
            .leftJoinAndSelect('positionMember.memberSkills', 'memberSkills')
            .leftJoinAndSelect('memberSkills.skill', 'skill')
            .getOne();

        if (!room) return null;

        const roomMembers = room.roomPositions
            .filter(rp => rp.member)
            .map(rp => {
                const m = rp.member!;
                return {
                    memberId: m.id,
                    memberName: m.nickname || m.globalName,
                    memberLevel: m.level || null,
                    memberClass: m.job?.name || '',
                    memberSkills: m.memberSkills?.map(ms => ({
                        skillName: ms.skill?.name || '',
                        skillImage: ms.skill?.image || '',
                        memberSkillLevel: ms.level,
                    })) || [],
                };
            });

        return {
            roomId: room.id,
            roomTitle: room.title,
            roomDesc: room.desc || null,
            roomCurrentMembers: roomMembers.length,
            roomMaxMembers: room.maxMembers,
            roomChannel: room.channel || null,
            roomMinLevel: room.minLevel,
            roomMinTime: room.minTime,
            roomHost: room.host.id,
            roomMembers: roomMembers,
            roomPositions: room.roomPositions.map(rp => ({
                positionName: rp.name,
                positionStatus: rp.status,
                positionComment: rp.comment || '',
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
            })),
        };
    },
    async findRoomById(roomId: string): Promise<selectedRoom | null> {
        const room = await this.createQueryBuilder('room')
            .where('room.id = :roomId', { roomId })
            .innerJoinAndSelect('room.host', 'host')
            .leftJoinAndSelect('room.roomPositions', 'roomPositions')
            .leftJoinAndSelect('roomPositions.member', 'positionMember')
            .leftJoinAndSelect('positionMember.job', 'job')
            .leftJoinAndSelect('positionMember.memberSkills', 'memberSkills')
            .leftJoinAndSelect('memberSkills.skill', 'skill')
            .getOne();

        if (!room) return null;

        const roomMembers = room.roomPositions
            .filter(rp => rp.member)
            .map(rp => {
                const m = rp.member!;
                return {
                    memberId: m.id,
                    memberName: m.nickname || m.globalName,
                    memberLevel: m.level || null,
                    memberClass: m.job?.name || '',
                    memberSkills: m.memberSkills?.map(ms => ({
                        skillName: ms.skill?.name || '',
                        skillImage: ms.skill?.image || '',
                        memberSkillLevel: ms.level,
                    })) || [],
                };
            });

        return {
            roomId: room.id,
            roomTitle: room.title,
            roomDesc: room.desc || null,
            roomCurrentMembers: roomMembers.length,
            roomMaxMembers: room.maxMembers,
            roomChannel: room.channel || null,
            roomMinLevel: room.minLevel,
            roomMinTime: room.minTime,
            roomHost: room.host.id,
            roomMembers: roomMembers,
            roomPositions: room.roomPositions.map(rp => ({
                positionName: rp.name,
                positionStatus: rp.status,
                positionComment: rp.comment || '',
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
            })),
        };
    }
});

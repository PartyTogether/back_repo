import { AppDataSource } from "../data-source";
import { Room } from "../models/entities/room";

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
    }
});

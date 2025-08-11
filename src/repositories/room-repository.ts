import { AppDataSource } from "../data-source";
import { Room } from "../models/entities/room";

export const roomRepository = AppDataSource.getRepository(Room).extend({
    async findRoomsByContinentOrHuntingGround(continent:string,huntingGround:string) {
        const query = this.createQueryBuilder('room')
            .innerJoinAndSelect('room.huntingGround','huntingGround')
            .innerJoinAndSelect('huntingGround.continent','continent')
            .innerJoinAndSelect('room.host','host')
            .loadRelationCountAndMap('room.currentMemberCount','room.members')

        if(huntingGround &&  huntingGround.trim() !== '' ){
            query.where('huntingGround.name = :huntingGround', {huntingGround: huntingGround} );
        } else {
            query.where('continent.name = :continent', {continent: continent});
        }

        query.orderBy('CASE WHEN (SELECT COUNT(*) FROM member WHERE member.room_id = room.room_id) >= room.maxMembers THEN 1 ELSE 0 END','ASC')
            .addOrderBy('room.createdAt','DESC');
        return query.getMany();
    }
});

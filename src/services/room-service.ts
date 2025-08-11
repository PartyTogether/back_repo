import { Request } from 'express';
import { RoomCreateReq } from "../dto/room-create-req";
import { ClientError } from "../error/client-error";
import { roomRepository } from "../repositories/room-repository";
import { memberRepository } from "../repositories/member-repository";
import { huntingGroundRepository } from "../repositories/hunting-ground-repository";
import { AppDataSource } from '../data-source';
import {RoomMetaRes} from "../dto/room-meta-res";
import {continentRepository} from "../repositories/continent-repository";
import { roomPositionRepository } from "../repositories/room-position-repository";
import {Room} from "../dto/rooms-res";
import {RoomsReq} from "../dto/rooms-req";

export const createRoom = async (req: Request) => {
    const memberId = req.member.id;
    const roomData = req.body as RoomCreateReq;
    // 트랜잭션 시작
    await AppDataSource.transaction(async (transactionalEntityManager) => {
        const roomRepo = transactionalEntityManager.withRepository(roomRepository);
        const memberRepo = transactionalEntityManager.withRepository(memberRepository);
        const hgRepo = transactionalEntityManager.withRepository(huntingGroundRepository);
        const roomPositionRepo = transactionalEntityManager.withRepository(roomPositionRepository);

        const member = await memberRepo.findOne({ where: { discord_id: memberId }, relations: ['room'] });
        if (!member) {
            throw new ClientError(404,"해당 유저를 찾을 수 없습니다.");
        }
        if (member.room) {
            throw new ClientError(400,"이미 속하신 방이 존재합니다.");
        }

        const huntingGround = await hgRepo.findOne({ where: { name: roomData.roomHuntingGround } });
        if (!huntingGround) {
            throw new ClientError(404,"해당 사냥터를 찾을 수 없습니다.");
        }

        if (roomData.roomMinLevel > 200) {
            throw new ClientError(400,"최소 레벨은 200을 초과할 수 없습니다.");
        }

        // 방생성
        const newRoom = roomRepo.create({
            host: member,
            title: roomData.roomTitle,
            desc: roomData.roomDesc,
            minLevel: roomData.roomMinLevel,
            maxMembers: roomData.roomMaxMembers,
            minTime: roomData.roomMinTime,
            channel: roomData.roomChannel,
            huntingGround: huntingGround
        });

        await roomRepo.save(newRoom);

        // 방장을 방의 멤버로 즉시 연결
        member.room = newRoom;
        await memberRepo.save(member);

        // 방에 대한 사냥터 자리
        for (const position of roomData.roomPositions) {
            const comment = roomData.roomPositionComments[position] || "";
            const isHostPosition = position === roomData.hostPosition;

            const newPosition = roomPositionRepo.create({
                name: position,
                comment: comment,
                room: newRoom,
                status: isHostPosition ? '모집완료' : '모집중',
                member: isHostPosition ? member : undefined,
            });
            await roomPositionRepo.save(newPosition);
        }
    });
};

export const getRoomMetaService = async(): Promise<RoomMetaRes[]> => {
    const continents = await continentRepository.getAllContinentsWithGrounds();

    return continents.map(continent => ({
        continentName: continent.name,
        continentImage: continent.image,
        huntingGrounds: continent.huntingGrounds.map(hg => ({
            huntingGroundName: hg.name,
            positions: [
                hg.position1,
                hg.position2,
                hg.position3,
                hg.position4,
                hg.position5,
                hg.position6,
            ].filter(Boolean),
        })),
    }));
};

export const getRoomsService = async(continent:string, huntingGround:string): Promise<Room[]> => {
    const roomsData = await roomRepository.findRoomsByContinentOrHuntingGround(continent,huntingGround);
    return roomsData.map(room => ({
        roomId: room.id,
        roomTitle: room.title,
        roomDesc: room.desc,
        roomContinent: room.huntingGround.continent.name,
        roomHuntingGround: room.huntingGround.name,
        roomHost: room.host.nickname ? room.host.nickname : room.host.globalname,
        roomCurrentMembers: room.currentMemberCount,
        roomMaxMembers: room.maxMembers,
        roomChannel: room.channel,
        roomMinLevel: room.minLevel,
        roomMinTime: room.minTime
    }))
}

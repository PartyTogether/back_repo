import { webSocketService } from './web-socket-service';
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
import { applicantRepository } from "../repositories/applicant-repository";
import {Room} from "../dto/rooms-res";
import {RoomsReq} from "../dto/rooms-req";
import {selectedRoom} from "../dto/room-me-res";

export const createRoom = async (req: Request) => {
    const memberId = req.member.id;
    const roomData = req.body as RoomCreateReq;
    // 트랜잭션 시작
    await AppDataSource.transaction(async (transactionalEntityManager) => {
        const roomRepo = transactionalEntityManager.withRepository(roomRepository);
        const memberRepo = transactionalEntityManager.withRepository(memberRepository);
        const hgRepo = transactionalEntityManager.withRepository(huntingGroundRepository);
        const roomPositionRepo = transactionalEntityManager.withRepository(roomPositionRepository);

        const member = await memberRepo.findOne({ where: { discord_id: memberId }, relations: ['roomPosition'] });
        if (!member) {
            throw new ClientError(404,"해당 유저를 찾을 수 없습니다.");
        }
        if (member.roomPosition) {
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

export const getRoomMetaService = async (req: Request): Promise<RoomMetaRes> => {
    const continentsData = await continentRepository.getAllContinentsWithGrounds();
    const continents = continentsData.map(continent => ({
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
            ].filter(Boolean) as string[],
        })),
    }));

    let isLoggedIn = false;
    let hasRoom = false;

    if (req.member && req.member.id) {
        isLoggedIn = true;
        const member = await memberRepository.findOne({
            where: { discord_id: req.member.id },
            relations: ['roomPosition'],
        });
        if (member && member.roomPosition) {
            hasRoom = true;
        }
    }

    return {
        continents: continents,
        isLoggedIn: isLoggedIn,
        hasRoom: hasRoom,
    };
};

export const getRoomsService = async(continent:string, huntingGround:string): Promise<Room[]> => {
    const roomsData = await roomRepository.findRoomsByContinentOrHuntingGround(continent,huntingGround);
    return roomsData.map(room => ({
        roomId: room.id,
        roomTitle: room.title,
        roomDesc: room.desc,
        roomContinent: room.huntingGround.continent.name,
        roomHuntingGround: room.huntingGround.name,
        roomHost: room.host.nickname ? room.host.nickname : room.host.globalName,
        roomCurrentMembers: room.currentMemberCount,
        roomMaxMembers: room.maxMembers,
        roomChannel: room.channel,
        roomMinLevel: room.minLevel,
        roomMinTime: room.minTime
    }))
}

export const getMyRoomService = async(req: Request): Promise<selectedRoom> => {
    const discordId = req.member.id;
    const member = await memberRepository.findOne({ where: { discord_id: discordId } });
    if(!member){
        throw new ClientError(404, "해당 유저를 찾을 수 없습니다.");
    }
    const room = await roomRepository.findMyRoom(member.id);
    if(!room){
        throw new ClientError(404, "참여하고 있는 방을 찾을 수 없습니다.");
    }
    return room;
}

export const applyRoomService = async (roomId: string, positionName: string, discordId: string)=> {
    const member = await memberRepository.findOne({ where : { discord_id : discordId }, relations: ['roomPosition'] });
    if(!member){
        throw new ClientError(404,"해당 유저를 찾을 수 없습니다.");
    }
    if(member.roomPosition){
        throw new ClientError(400,"이미 참여하고 있는 방이 있습니다.");
    }
    const roomPosition = await roomPositionRepository.findOne({ where : { room : { id: roomId }, name : positionName}, relations: ['member']});
    if(!roomPosition){
        throw new ClientError(404,"해당 포지션을 찾을 수 없습니다.");
    }
    if(roomPosition.member){
        throw new ClientError(400,"이미 다른 사람이 차지한 포지션 입니다.");
    }

    await applicantRepository.save({
        member: member,
        roomPosition: roomPosition
    });
}

export const joinRoom = async (roomId: string, positionName: string, discordId: string) => {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
        const memberRepo = transactionalEntityManager.withRepository(memberRepository);
        const roomPositionRepo = transactionalEntityManager.withRepository(roomPositionRepository);

        const member = await memberRepo.findOne({ where: { discord_id: discordId }, relations: ['roomPosition'] });
        if (!member) {
            throw new ClientError(404, "해당 유저를 찾을 수 없습니다.");
        }
        if (member.roomPosition) {
            throw new ClientError(400, "이미 참여하고 있는 방이 있습니다.");
        }

        const position = await roomPositionRepo.findOne({ where: { room: { id: roomId }, name: positionName }, relations: ['room', 'member'] });
        if (!position) {
            throw new ClientError(404, "해당 포지션을 찾을 수 없습니다.");
        }
        if (position.member) {
            throw new ClientError(400, "이미 다른 사람이 차지한 포지션입니다.");
        }

        position.member = member;
        position.status = '모집완료';
        await roomPositionRepo.save(position);
    });

    const updatedRoomData = await roomRepository.findRoomById(roomId);
    if (updatedRoomData) {
        webSocketService.broadcastRoomUpdate(roomId, updatedRoomData);
    }
};

export const leaveRoom = async (discordId: string) => {
    let roomId: string | undefined;

    await AppDataSource.transaction(async (transactionalEntityManager) => {
        const memberRepo = transactionalEntityManager.withRepository(memberRepository);
        const roomPositionRepo = transactionalEntityManager.withRepository(roomPositionRepository);

        const member = await memberRepo.findOne({ where: { discord_id: discordId }, relations: ['roomPosition', 'roomPosition.room'] });
        if (!member || !member.roomPosition) {
            throw new ClientError(404, "참여하고 있는 방이 없습니다.");
        }

        const position = member.roomPosition;
        roomId = position.room.id;

        const room = await roomRepository.findOne({where: {id: roomId}, relations: ['host']});
        if (room?.host.id === member.id) {
            throw new ClientError(400, "방장은 방을 나갈 수 없습니다. 방을 삭제해주세요.");
        }

        position.member = null;
        position.status = '모집중';
        await roomPositionRepo.save(position);
    });

    if (roomId) {
        const updatedRoomData = await roomRepository.findRoomById(roomId);
        if (updatedRoomData) {
            webSocketService.broadcastRoomUpdate(roomId, updatedRoomData);
        }
    }
};
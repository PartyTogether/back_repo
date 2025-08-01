
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
            min_level: roomData.roomMinLevel,
            max_members: roomData.roomMaxMembers,
            min_time: roomData.roomMinTime,
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

        member.room = newRoom;
        await memberRepo.save(member);
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
                hg.huntingPosition?.huntingPosition1,
                hg.huntingPosition?.huntingPosition2,
                hg.huntingPosition?.huntingPosition3,
                hg.huntingPosition?.huntingPosition4,
                hg.huntingPosition?.huntingPosition5,
                hg.huntingPosition?.huntingPosition6,
            ].filter(Boolean),
        })),
    }));
};
""
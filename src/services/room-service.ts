import { Request } from 'express';
import { RoomCreateReq } from "../dto/room-create-req";
import { ClientError } from "../error/client-error";
import { roomRepository } from "../repositories/room-repository";
import { memberRepository } from "../repositories/member-repository";
import { huntingGroundRepository } from "../repositories/hunting-ground-repository";
import { AppDataSource } from '../data-source';

export const createRoom = async (req: Request) => {
    const memberId = req.member.id;
    const roomData = req.body as RoomCreateReq;
    // 트랜잭션 시작
    await AppDataSource.transaction(async (transactionalEntityManager) => {
        const roomRepo = transactionalEntityManager.withRepository(roomRepository);
        const memberRepo = transactionalEntityManager.withRepository(memberRepository);
        const hgRepo = transactionalEntityManager.withRepository(huntingGroundRepository);

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

        member.room = newRoom;
        await memberRepo.save(member);
    });
};

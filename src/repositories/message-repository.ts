import {AppDataSource} from "../data-source";
import {Message} from "../models/entities/message";
import {ChatMessageRes} from "../dto/chat-message-res";

export const messageRepository = AppDataSource.getRepository(Message).extend({
    async findMessageByRoomId(roomId:string):Promise<ChatMessageRes[] | null> {
        const result = await this.createQueryBuilder('message')
            .leftJoinAndSelect('message.member','member')
            .leftJoinAndSelect('message.room','room')
            .where('roomId = :roomId', {roomId})
            .orderBy('message.createdAt','ASC')
            .getMany();

        return result.map(r => ({
            messageId: r.id,
            messageContent: r.content,
            messageCreatedAt: r.createdAt.toISOString(),
            memberId: r.member.id,
            memberName: r.member.nickname || r.member.globalName,
        }));
    },
});
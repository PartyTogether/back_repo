import {roomRepository} from "../repositories/room-repository";
import {ClientError} from "../error/client-error";
import {memberRepository} from "../repositories/member-repository";
import {messageRepository} from "../repositories/message-repository";
import {webSocketService} from "./web-socket-service";
import {ChatMessageRes} from "../dto/chat-message-res";

export const sendMessageService = async(roomId:string, content:string, discordId:string) => {
    const room = await roomRepository.findOne({ where : { id:roomId }});
    if(!room){
        throw new ClientError(404,"해당 방이 존재하지 않습니다.");
    }
    const member = await memberRepository.findOne({ where : { discord_id:discordId }});
    if(!member){
        throw new ClientError(404,"로그인이 필요한 기능입니다..");
    }
    const savedMessage = await messageRepository.save({
        content: content,
        room:room,
        member:member,
    })
    const newMessage:ChatMessageRes = {
        messageId: savedMessage.id,
        messageCreatedAt: savedMessage.createdAt.toISOString(),
        messageContent: savedMessage.content,
        memberId: member.id,
        memberName: member.nickname || member.globalName,
    };
    webSocketService.broadcast(roomId,{ type:'newChat', payload:{ newMessage } });
}
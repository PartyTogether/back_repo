import { NextFunction,Request,Response } from "express";
import { plainToInstance } from"class-transformer";
import { validate } from "class-validator";
import {ChatMessageReq} from "../dto/chat-message-req";
import {ClientError} from "../error/client-error";
import {sendMessageService} from "../services/message-service";

export const sendMessageController = async(req:Request, res:Response, next:NextFunction) => {
    try{
        const reqBody = plainToInstance(ChatMessageReq,req.body);
        const errors = await validate(reqBody);
        if(errors.length > 0){
            throw new ClientError(400,"잘못된 요청입니다.");
        }
        await sendMessageService(reqBody.roomId,reqBody.content,req.member.id);
        res.status(201).json({ message:"메세지 보내기 성공"});
    }catch (err){
        next(err);
    }
}
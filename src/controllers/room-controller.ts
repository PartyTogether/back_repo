import { NextFunction, Request, Response } from 'express';
import { createRoom } from '../services/room-service';
import { RoomCreateReq } from '../dto/room-create-req';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ClientError } from '../error/client-error';
import {getRoomMetaService} from "../services/room-service";

const getErrorMessages = (errors: ValidationError[]): string[] => {
    let messages: string[] = [];
    for (const error of errors) {
        if (error.constraints) {
            messages = messages.concat(Object.values(error.constraints));
        }
        if (error.children && error.children.length > 0) {
            messages = messages.concat(getErrorMessages(error.children));
        }
    }
    return messages;
};

export const createRoomController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reqBody = plainToInstance(RoomCreateReq, req.body);
        const errors = await validate(reqBody);
        if (errors.length > 0) {
            const errorMessages = getErrorMessages(errors);
            throw new ClientError(400,errorMessages.join(', '));
        }

        await createRoom(req);
        res.status(201).json({ message: "방 생성 성공" });
    } catch (err) {
        next(err);
    }
};


export const getRoomMetaController = async(_: Request, res: Response) => {
    try{
        console.log("방찾기 메타 데이터 컨트롤러");
        const data = await getRoomMetaService();
        res.status(200).json(data);
    } catch (error){
        console.error("예기치 못한 오류가 발생했습니다.",error);
        res.status(400).json({message:'잘못된 요청입니다.'})
    }
}
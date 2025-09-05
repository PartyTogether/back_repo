import {IsNotEmpty, IsString, IsUUID} from "class-validator";

export class ChatMessageReq {
    @IsUUID()
    @IsNotEmpty()
    roomId!:string;

    @IsNotEmpty()
    @IsString()
    content!: string;


}
import {IsNotEmpty, IsUUID} from "class-validator";

export class RoomApplyReq {

    @IsUUID()
    roomId!: string;

    @IsNotEmpty()
    roomPositionName!: string;
}
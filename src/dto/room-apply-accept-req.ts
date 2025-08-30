import {IsNotEmpty, IsUUID} from "class-validator";

export class RoomApplyAcceptReq {
    @IsUUID()
    @IsNotEmpty()
    applicantId!: string;
}
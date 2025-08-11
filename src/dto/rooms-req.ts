import { IsString, IsOptional } from "class-validator";

export class RoomsReq{

    @IsString()
    @IsOptional()
    continent!: string;

    @IsString()
    @IsOptional()
    huntingGround!: string;
}
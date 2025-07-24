import {IsNotEmpty, IsNumber, IsString, Length, MaxLength} from 'class-validator';

export class RoomCreateReq {
    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    roomTitle!: string;

    @IsString()
    @MaxLength(40)
    roomDesc!: string;

    @IsNumber()
    roomMinLevel!: number;

    @IsNumber()
    roomMaxMembers!: number;

    @IsString()
    @IsNotEmpty()
    roomMinTime!: string;

    @IsString()
    roomChannel!: string;

    @IsString()
    @IsNotEmpty()
    roomHuntingGround!: string;
}
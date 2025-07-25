import {IsNotEmpty, IsNumber, IsString, Length, Max, MaxLength, Min} from 'class-validator';

export class RoomCreateReq {
    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    roomTitle!: string;

    @IsString()
    @MaxLength(40)
    roomDesc!: string;

    @IsNumber()
    @Min(0)
    roomMinLevel!: number;

    @IsNumber()
    @Min(2)
    @Max(6)
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
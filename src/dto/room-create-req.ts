import {IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Max, MaxLength, Min} from 'class-validator';

export class RoomCreateReq {
    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    roomTitle!: string;

    @IsString()
    @MaxLength(40)
    @IsOptional()
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
    @IsOptional()
    roomChannel!: string;

    @IsString()
    @IsNotEmpty()
    roomHuntingGround!: string;

    @IsArray()
    @IsString({ each: true })
    roomPositions!: string[];

    @IsObject()
    roomPositionComments!: Record<string, string>;

    @IsString()
    @IsNotEmpty()
    hostPosition!: string;
}

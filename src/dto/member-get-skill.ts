import {IsNumber, IsOptional, IsString} from "class-validator";

export class MemberGetSkill {
    @IsString()
    name!: string;

    @IsNumber()
    level!: number;

    @IsNumber()
    masterLevel!: number;

    @IsOptional()
    @IsString()
    image!: string | null;
}
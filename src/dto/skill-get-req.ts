import {IsString, MaxLength} from "class-validator";

export class SkillGetReq    {
    @IsString()
    @MaxLength(20)
    job!: string
}
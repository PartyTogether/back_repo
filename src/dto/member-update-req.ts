import {MemberGetSkill} from "./member-get-skill";
import {IsArray, IsNumber, IsString, MaxLength, Min, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class MemberUpdateReq {
    @IsNumber()
    @Min(1)
    level!: number

    @IsString()
    @MaxLength(20)
    nickName!: string | null

    @IsString()
    @MaxLength(20)
    job!: string | null

    @IsString()
    @MaxLength(100)
    offerComment!: string | null

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberGetSkill)
    skill!: MemberGetSkill[]
}
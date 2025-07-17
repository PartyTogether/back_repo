import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from 'typeorm';
import {Skill} from "./skill";
import {Member} from "./member";

@Entity()
export class MemberSkill{
    @PrimaryGeneratedColumn('uuid',{name:'member_skill_id'})
    id!:string;

    @Column({name:'member_skill_level'})
    level!: number;

    @ManyToOne(() => Skill,(skill) => skill.memberSkills)
    skill!: Skill;

    @ManyToOne(() => Member,(member) => member.memberSkills)
    member!: Member;
}
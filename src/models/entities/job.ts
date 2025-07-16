import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {Skill} from "./skill";
import {Member} from "./member";

@Entity()
export class Job {
    @PrimaryGeneratedColumn('uuid',{name:'job_id'})
    id!: string;

    @Column({name:'job_name', unique:true})
    name!: string;

    @OneToMany(() => Skill, (skill) => skill.job)
    skills!: Skill[];

    @OneToMany(() => Member, (member) => member.job)
    members!: Member[];
}
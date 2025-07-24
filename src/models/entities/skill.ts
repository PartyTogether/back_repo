import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from 'typeorm';
import {Job} from "./job";
import {MemberSkill} from "./member-skill";

@Entity()
export class Skill{
    @PrimaryGeneratedColumn('uuid',{name:'skill_id'})
    id!: string;

    @Column({name:'skill_name',unique:true})
    name!: string;

    @Column({name:'skill_master_level'})
    master_level!: number;

    @Column({name:'skill_image'})
    image!: string;

    @ManyToOne(() => Job, (job) => job.skills)
    @JoinColumn({name:'job_id'})
    job!: Job;

    @OneToMany(() => MemberSkill, (memberSkill) => memberSkill.skill)
    memberSkills!: MemberSkill[];

}
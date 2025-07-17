import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import {Job} from "./job";

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
    job!: Job;

}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import {Job} from "./job";

@Entity()
export class Skill{
    @PrimaryGeneratedColumn('uuid',{name:'skill_id'})
    id!: string;

    @Column({name:'skill_name'})
    name!: string;

    @Column({name:'skill_level'})
    level!: number;

    @Column({name:'skill_image'})
    image!: string;

    @ManyToOne(() => Job, (job) => job.skills)
    job!: Job;

}
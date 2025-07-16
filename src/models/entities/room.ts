import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from 'typeorm';
import {HuntingGround} from "./hunting-ground";
import {Applicant} from "./applicant";

@Entity()
export class Room{
    @PrimaryGeneratedColumn('uuid',{name:'room_id'})
    id!: string;

    @Column({name:'room_host'})
    host!: string;       // 방장

    @Column({name:'room_title'})
    title!: string;      // 방제

    @Column({name:'room_req_level'})
    req_level!: number;  // 최소 레벨

    @Column({name:'room_req_time'})
    req_time!: number;   // 최소 사냥 시간

    @Column({name:'room_channel'})
    channel!: string;    // 채널

    @Column({name:'room_max_man'})
    max_man!: number;    // 최대인원수

    @Column({name:'room_desc'})
    desc!: string;       // 설명

    @ManyToOne(() => HuntingGround, (huntingGround) => huntingGround.rooms)
    huntingGround!: HuntingGround;

    @OneToMany(() => Applicant,(applicant) => applicant.room)
    applicants!: Applicant[];
}
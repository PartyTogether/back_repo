import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from 'typeorm';
import {HuntingGround} from "./hunting-ground";
import {Applicant} from "./applicant";
import {Member} from "./member";

@Entity()
export class Room{
    @PrimaryGeneratedColumn('uuid',{name:'room_id'})
    id!: string;

    @ManyToOne(() => Member)
    @JoinColumn({name:'room_host'})
    host!: Member;       // 방장

    @Column({name:'room_title'})
    title!: string;      // 방제

    @Column({name:'room_min_level'})
    min_level!: number;  // 최소 레벨

    @Column({name:'room_min_time'})
    min_time!: string;   // 최소 사냥 시간

    @Column({name:'room_channel'})
    channel!: string;    // 채널

    @Column({name:'room_max_members'})
    max_members!: number;    // 최대인원수

    @Column({name:'room_desc'})
    desc!: string;       // 설명

    @ManyToOne(() => HuntingGround, (huntingGround) => huntingGround.rooms)
    huntingGround!: HuntingGround;

    @OneToMany(() => Applicant,(applicant) => applicant.room)
    applicants!: Applicant[];

    @OneToMany(() => Member, (member) => member.room)
    members!: Member[];
}
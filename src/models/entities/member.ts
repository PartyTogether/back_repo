import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, OneToOne} from 'typeorm';
import {Job} from "./job";
import {Applicant} from "./applicant";
import {application} from "express";
import {Bookmark} from "./bookmark";
import {MemberSkill} from "./member-skill";
import {Room} from "./room";
import {RoomPosition} from "./room-position";
import {Message} from "./message";

@Entity()
export class Member{
    @PrimaryGeneratedColumn('uuid', {name:'member_id'})
    id!: string;

    @Column({name:'member_discord_id', type: 'varchar', unique:true})
    discord_id!: string   // 디스코드 ID

    @Column({name:'member_globalname', type: 'varchar'})
    globalName!: string; // 디스코드 글로벌 이름

    @Column({name:'member_username', type: 'varchar'})
    username!: string;    // 디스코드 사용자 이름

    @Column({name:'member_avatar', type:'varchar', length:255 , nullable:true})
    avatar!: string | null;         // 디스코드 아바타 해시

    @Column({name:'member_discriminator', type:'varchar'})
    discriminator!: string;  // 디스코드 태그번호

    @Column({name:'member_public_flags', type: 'varchar'})
    public_flags!:number;    // 디스코드 공개 플래그

    @Column({name:'member_flags', type: 'varchar'})
    flags!: number;          // 디스코드 사용자 특성 플래그

    @Column({name:'member_mfa_enabled', type: "boolean"})
    mfa_enabled!: boolean;   // 디스코드 2단계 인증 여부

    @Column({name:'member_verified', type: 'boolean'})
    verified!: boolean;      // 디스코드 이메일 인증 여부

    @Column({name:'member_offer_comment', type: 'varchar', length: 100, nullable:true})
    offer_comment!: string | null;  // 구인 신청 포맷

    @Column({name:'member_level', type: 'integer', default: 1})
    level!: number | null;           // 사용자 레벨

    @Column({name:'member_nickname', type: 'varchar', nullable:true})
    nickname!: string | null;        // 사용자 닉네임


    @OneToOne(() => RoomPosition, (roomPosition) => roomPosition.member)
    roomPosition!: RoomPosition;

    @ManyToOne(() => Job, (job) => job.members)
    @JoinColumn({name:'job_id'})
    job!: Job;

    @OneToMany(() => MemberSkill,(memberSkill) => memberSkill.member)
    memberSkills!: MemberSkill[];

    @OneToMany(() => Bookmark, (bookmark) => bookmark.member)
    bookmarks!: Bookmark[];

    @OneToMany(() => Applicant, (applicant) => applicant.member)
    applicants!: Applicant[];

    @OneToMany(() => Message, (message) => message.member)
    messages!: Message[];

}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from 'typeorm';
import {Job} from "./job";
import {Applicant} from "./applicant";
import {application} from "express";
import {Bookmark} from "./bookmark";
import {MemberSkill} from "./member-skill";

@Entity()
export class Member{
    @PrimaryGeneratedColumn('uuid', {name:'member_id'})
    id!: string;

    @Column({name:'member_discord_id', unique:true})
    discord_id!: string   // 디스코드 ID

    @Column({name:'member_username'})
    username!: string;    // 디스코드 사용자 이름

    @Column({name:'member_avatar', nullable:true})
    avatar!: string;         // 디스코드 아바타 해시

    @Column({name:'member_discriminator'})
    discriminator!: string;  // 디스코드 태그번호

    @Column({name:'member_public_flags'})
    public_flags!:number;    // 디스코드 공개 플래그

    @Column({name:'member_flags'})
    flags!: number;          // 디스코드 사용자 특성 플래그

    @Column({name:'member_mfa_enabled'})
    mfa_enabled!: boolean;   // 디스코드 2단계 인증 여부

    @Column({name:'member_verified'})
    verified!: boolean;      // 디스코드 이메일 인증 여부

    @Column({name:'member_offer_comment', nullable:true})
    offer_comment!: string;  // 구인 신청 포맷

    @Column({name:'member_level', nullable:true})
    level!: number;           // 사용자 레벨

    @Column({name:'member_nickname', nullable:true})
    nickname!: string;        // 사용자 닉네임

    @ManyToOne(() => Job, (job) => job.members)
    job!: Job;

    @OneToMany(() => MemberSkill,(memberSkill) => memberSkill.member)
    memberSkills!: MemberSkill[];

    @OneToMany(() => Bookmark, (bookmark) => bookmark.member)
    bookmarks!: Bookmark[];

    @OneToMany(() => Applicant, (applicant) => applicant.member)
    applicants!: Applicant[];        // 원래 한 파티만 지원 가능함, 허나 리스트로 둔 이유는 구조상,
                                     // 서비스 로직에서 한 명당 한 파티에만 지원하게 처리
}

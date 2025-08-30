import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn} from 'typeorm';
import {Room} from "./room";
import {Member} from "./member";
import {Applicant} from "./applicant";
import {application} from "express";
import {RoomPositionStatus} from "./room-position-status";

@Entity()
export class RoomPosition{
    @PrimaryGeneratedColumn('uuid',{name:'room_position_id'})
    id!:string;

    @Column({
        name:'room_position_name',
        type:'varchar',
    })
    name!:string;

    @Column({
        name:'room_position_status',
        type:'enum',
        enum: RoomPositionStatus,
        default: RoomPositionStatus.OPEN
    })
    status!:string;

    @Column({
        name:'room_position_comment',
        type:'varchar',
        nullable:true,
    })
    comment!:string | null;

    @ManyToOne(() => Room, (room) => room.roomPositions)
    @JoinColumn({name:'room_id'})
    room!: Room;

    @OneToOne(() => Member, (member) => member.roomPosition, {nullable:true})
    @JoinColumn({name:'member_id'})
    member!: Member | null;

    @OneToMany(() => Applicant, (application) => application.roomPosition)
    applicants!: Applicant[];
}

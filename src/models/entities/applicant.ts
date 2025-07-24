import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import {Member} from "./member";
import {Room} from "./room";

@Entity()
export class Applicant{
    @PrimaryGeneratedColumn('uuid',{name:'applicant_id'})
    id!: string;

    @ManyToOne(() => Member, (member) => member.applicants)
    @JoinColumn({name:'member_id'})
    member!: Member;

    @ManyToOne(() => Room, (room) => room.applicants)
    @JoinColumn({name:'room_id'})
    room!: Room;

}
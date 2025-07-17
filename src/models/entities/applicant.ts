import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import {Member} from "./member";
import {Room} from "./room";

@Entity()
export class Applicant{
    @PrimaryGeneratedColumn('uuid',{name:'applicant_id'})
    id!: string;

    @ManyToOne(() => Member, (member) => member.applicants)
    member!: Member;

    @ManyToOne(() => Room, (room) => room.applicants)
    room!: Room;

}
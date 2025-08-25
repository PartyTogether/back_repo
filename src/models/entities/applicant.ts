import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique} from 'typeorm';
import {Member} from "./member";
import {RoomPosition} from "./room-position";

@Entity()
@Unique(['member','roomPosition'])
export class Applicant{
    @PrimaryGeneratedColumn('uuid',{name:'applicant_id'})
    id!: string;

    @ManyToOne(() => Member, (member) => member.applicants)
    @JoinColumn({name:'member_id'})
    member!: Member;

    @ManyToOne(() => RoomPosition, (roomPosition) => roomPosition.applicants)
    @JoinColumn({name:'room_position_id'})
    roomPosition!: RoomPosition;

}
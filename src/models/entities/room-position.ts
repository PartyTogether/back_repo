import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn} from 'typeorm';
import {Room} from "./room";
import {Member} from "./member";

@Entity()
export class RoomPosition{
    @PrimaryGeneratedColumn('uuid',{name:'room_position_id'})
    id!:string;

    @Column({name:'room_position_name'})
    name!:string;

    @Column({name:'room_position_status'})
    status!:string;

    @Column({name:'room_position_comment'})
    comment!:string;

    @ManyToOne(() => Room, (room) => room.roomPositions)
    @JoinColumn({name:'room_id'})
    room!: Room;

    @ManyToOne(() => Member, (member) => member.roomPositions)
    @JoinColumn({name:'member_id'})
    member!: Member;
}

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    OneToOne,
    CreateDateColumn
} from 'typeorm';
import {Room} from "./room";
import {Member} from "./member";

@Entity()
export class Message{
    @PrimaryGeneratedColumn('uuid',{name:'message_id'})
    id!: string;

    @Column({
        type:'varchar',
        name:'message_content'
    })
    content!: string;

    @CreateDateColumn({
        type:'timestamp',
        default:() => 'CURRENT_TIMESTAMP(6)',
        name:'message_created_at'
    })
    createdAt!: Date

    @ManyToOne(() => Room,(room)=> room.messages)
    room!: Room;

    @ManyToOne(() => Member,(member) => member.messages)
    member!: Member;
}
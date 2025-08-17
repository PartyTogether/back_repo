import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    OneToOne
} from 'typeorm';
import {HuntingGround} from "./hunting-ground";
import {Applicant} from "./applicant";
import {Member} from "./member";
import {RoomPosition} from "./room-position";

@Entity()
export class Room{
    @PrimaryGeneratedColumn('uuid',{
        name:'room_id',
    })
    id!: string;

    @OneToOne(() => Member)
    @JoinColumn({name:'room_host'})
    host!: Member;       // 방장

    @Column({
        name:'room_title',
        type:'varchar',
        length:40,
    })
    title!: string;      // 방제

    @Column({
        name:'room_min_level',
        type:'integer',
        default:1
    })
    minLevel!: number;  // 최소 레벨

    @Column({
        name:'room_min_time',
        type:'varchar',
        default:'상관없음',
    })
    minTime!: string;   // 최소 사냥 시간

    @Column({name:'room_channel',
        type: 'varchar',
        nullable:true
    })
    channel!: string | null;    // 채널

    currentMemberCount!: number;   // 현재 인원수 * 임시 필드 *

    @Column({
        name:'room_max_members',
        type:'integer',
    })
    maxMembers!: number;    // 최대인원수

    @Column({name:'room_desc',
        type: 'varchar',
        length:40,
        nullable:true
    })
    desc!: string | null;       // 설명

    @CreateDateColumn({
        type:'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        name:'room_create_at'
    })
    createdAt!: Date;

    @ManyToOne(() => HuntingGround, (huntingGround) => huntingGround.rooms)
    @JoinColumn({name:'hunting_ground_id'})
    huntingGround!: HuntingGround;

    @OneToMany(() => RoomPosition, (roomPosition) => roomPosition.room)
    roomPositions!: RoomPosition[];
}
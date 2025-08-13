import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn} from 'typeorm';
import { HuntingGroundType } from './hunting-ground-type';
import {Continent} from "./continent";
import {Room} from "./room";
import {Bookmark} from "./bookmark";

@Entity()
export class HuntingGround{
    @PrimaryGeneratedColumn('uuid',{name:'hunting_ground_id'})
    id!: string;

    @Column({
        name:'hunting_ground_name',
        unique:true,
        type:'varchar',
        length:40,
    })
    name!: string;        // 사냥터 이름

    @Column({
        name:'hunting_ground_rec_level',
        type:'integer',
        nullable:true,
    })
    recLevel!: number | null;   // 적정 레벨

    @Column({name:'hunting_ground_type',
        type: 'enum',
        enum: HuntingGroundType,
        default: HuntingGroundType.Unknown
    })
    type!: string;         // 사냥터 타입

    @Column({
        name:'hunting_ground_position_1',
        type:'varchar',
        nullable:true,
    })
    position1!: string | null;

    @Column({
        name:'hunting_ground_position_2',
        type:'varchar',
        nullable:true,
    })
    position2!: string | null;

    @Column({
        name:'hunting_ground_position_3',
        type:'varchar',
        nullable:true,
    })
    position3!: string | null;

    @Column({
        name:'hunting_ground_position_4',
        type:'varchar',
        nullable:true,
    })
    position4!: string | null;

    @Column({
        name:'hunting_ground_position_5',
        type:'varchar',
        nullable:true,
    })
    position5!: string | null;

    @Column({
        name:'hunting_ground_position_6',
        type:'varchar',
        nullable:true,
    })
    position6!: string | null;


    @ManyToOne(() => Continent, (continent) => continent.huntingGrounds)
    @JoinColumn({name:'continent_id'})
    continent!: Continent;

    @OneToMany(() => Room, (room) => room.huntingGround)
    rooms!: Room[];

    @OneToMany(() => Bookmark, (bookmark) => bookmark.member)
    bookmarks!: Bookmark[];
}
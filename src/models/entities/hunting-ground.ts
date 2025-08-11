import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn} from 'typeorm';
import { HuntingGroundType } from './hunting-ground-type';
import {Continent} from "./continent";
import {Room} from "./room";
import {Bookmark} from "./bookmark";

@Entity()
export class HuntingGround{
    @PrimaryGeneratedColumn('uuid',{name:'hunting_ground_id'})
    id!: string;

    @Column({name:'hunting_ground_name', unique:true})
    name!: string;        // 사냥터 이름

    @Column({name:'hunting_ground_rec_level'})
    rec_level!: number;   // 적정 레벨

    @Column({name:'hunting_ground_type',
        type: 'enum',
        enum: HuntingGroundType,
        default: HuntingGroundType.Unknown
    })
    type!: string;         // 사냥터 타입

    @Column({name:'hunting_ground_position_1'})
    position_1!: string;

    @Column({name:'hunting_ground_position_2'})
    position_2!: string;

    @Column({name:'hunting_ground_position_3'})
    position_3!: string;

    @Column({name:'hunting_ground_position_4'})
    position_4!: string;

    @Column({name:'hunting_ground_position_5'})
    position_5!: string;

    @Column({name:'hunting_ground_position_6'})
    position_6!: string;


    @ManyToOne(() => Continent, (continent) => continent.huntingGrounds)
    @JoinColumn({name:'continent_id'})
    continent!: Continent;

    @OneToMany(() => Room, (room) => room.huntingGround)
    rooms!: Room[];

    @OneToMany(() => Bookmark, (bookmark) => bookmark.member)
    bookmarks!: Bookmark[];
}
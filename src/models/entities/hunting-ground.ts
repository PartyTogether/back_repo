import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne} from 'typeorm';
import { HuntingGroundType } from './hunting-ground-type';
import {Continent} from "./continent";
import {Room} from "./room";
import {Bookmark} from "./bookmark";
import {HuntingPosition} from "./hunting-position";

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

    @ManyToOne(() => Continent, (continent) => continent.huntingGrounds)
    continent!: Continent;

    @OneToMany(() => Room, (room) => room.huntingGround)
    rooms!: Room[];

    @OneToMany(() => Bookmark, (bookmark) => bookmark.member)
    bookmarks!: Bookmark[];

    @OneToOne(() => HuntingPosition, (huntingPosition) => huntingPosition.huntingGround)
    huntingPosition!: HuntingPosition;
}
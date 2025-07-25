import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from 'typeorm';
import {Member} from "./member";
import {HuntingGround} from "./hunting-ground";

@Entity()
export class Bookmark{
    @PrimaryGeneratedColumn('uuid',{name:'bookmark_id'})
    id!: string;

    @ManyToOne(() => Member, (member) => member.bookmarks)
    @JoinColumn({name:'member_id'})
    member!: Member;

    @ManyToOne(() => HuntingGround, (huntingGround) => huntingGround.bookmarks)
    @JoinColumn({name:'hunting_ground_id'})
    huntingGround!: HuntingGround;
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from 'typeorm';
import {Member} from "./member";
import {HuntingGround} from "./hunting-ground";

@Entity()
export class Bookmark{
    @PrimaryGeneratedColumn('uuid',{name:'bookmark_id'})
    id!: string;

    @ManyToOne(() => Member, (member) => member.bookmarks)
    member!: Member;

    @ManyToOne(() => HuntingGround, (huntingGround) => huntingGround.bookmarks)
    huntingGround!: HuntingGround;
}
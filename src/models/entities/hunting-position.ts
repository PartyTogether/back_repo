import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn} from 'typeorm';
import {HuntingGround} from "./hunting-ground";

@Entity()
export class HuntingPosition{
    @PrimaryGeneratedColumn('uuid',{name:'hunting_position_id'})
    id!:string;

    @Column({name:'hunting_position_1'})
    huntingPosition1!:string

    @Column({name:'hunting_position_2'})
    huntingPosition2!:string

    @Column({name:'hunting_position_3'})
    huntingPosition3!:string

    @Column({name:'hunting_position_4'})
    huntingPosition4!:string

    @Column({name:'hunting_position_5'})
    huntingPosition5!:string

    @Column({name:'hunting_position_6'})
    huntingPosition6!:string

    @OneToOne(() => HuntingGround, (huntingGround) => huntingGround.huntingPosition)
    @JoinColumn({name:'hunting_ground_id'})
    huntingGround!: HuntingGround;
}
import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {HuntingGround} from "./hunting-ground";

@Entity()
export class Continent {
    @PrimaryGeneratedColumn('uuid',{name:'continent_id'})
    id!: string;

    @Column({name:'continent_name', unique:true})
    name!: string;    // 대륙이름

    @Column({name:'continent_image'})
    image!: string;   // 대륙 사진

    @OneToMany(() => HuntingGround, (huntingGround) => huntingGround.continent)
    huntingGrounds!: HuntingGround[];
}
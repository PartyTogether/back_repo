import { AppDataSource } from "../data-source";
import {Continent} from "../models/entities/continent";

export const getAllContinentsWithGrounds = async () => {
    return await AppDataSource.getRepository(Continent)
        .createQueryBuilder('continent')
        .leftJoinAndSelect('continent.huntingGrounds','huntingGround')
        .getMany()
}
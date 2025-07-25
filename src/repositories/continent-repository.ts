import { AppDataSource } from "../data-source";
import { Continent } from "../models/entities/continent";
import { Repository } from "typeorm";

export const continentRepository = AppDataSource.getRepository(Continent).extend({
    async getAllContinentsWithGrounds() {
        return await this.createQueryBuilder('continent')
            .leftJoinAndSelect('continent.huntingGrounds','huntingGround')
            .leftJoinAndSelect('huntingGround.huntingPosition','huntingPosition')
            .getMany();
    }
});
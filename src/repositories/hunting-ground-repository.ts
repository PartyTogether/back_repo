import { AppDataSource } from "../data-source";
import { HuntingGround } from "../models/entities/hunting-ground";

export const huntingGroundRepository = AppDataSource.getRepository(HuntingGround).extend({
});

import { AppDataSource } from "../data-source";
import { Room } from "../models/entities/room";

export const roomRepository = AppDataSource.getRepository(Room).extend({
});

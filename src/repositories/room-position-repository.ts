import { AppDataSource } from "../data-source";
import { RoomPosition } from "../models/entities/room-position";

export const roomPositionRepository = AppDataSource.getRepository(RoomPosition);

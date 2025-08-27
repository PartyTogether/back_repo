import { AppDataSource } from "../data-source";
import { Member } from "../models/entities/member";
import {Job} from "../models/entities/job";

export const jobRepository = AppDataSource.getRepository(Job).extend({
});

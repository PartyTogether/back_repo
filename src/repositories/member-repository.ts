import { AppDataSource } from "../data-source";
import { Member } from "../models/entities/member";

export const memberRepository = AppDataSource.getRepository(Member).extend({
});

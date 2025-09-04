import { AppDataSource } from "../data-source";
import { Member } from "../models/entities/member";
import {Job} from "../models/entities/job";
import {Skill} from "../models/entities/skill";
import {MemberSkill} from "../models/entities/member-skill";


export const memberSkillRepository = AppDataSource.getRepository(MemberSkill).extend({
});

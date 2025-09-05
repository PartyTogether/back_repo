import {Request} from "express";
import {AppDataSource} from "../data-source";
import {memberRepository} from "../repositories/member-repository";
import {ClientError} from "../error/client-error";
import {MemberGetRes} from "../dto/member-get-res";
import {jobRepository} from "../repositories/job-repository";
import {memberSkillRepository} from "../repositories/member-skill-repository";
import {MemberUpdateReq} from "../dto/member-update-req";
import {MemberGetSkill} from "../dto/member-get-skill";
import {Member} from "../models/entities/member";
import {MemberUpdateRes} from "../dto/member-update-res";
import {Skill} from "../models/entities/skill";
import {MemberSkill} from "../models/entities/member-skill";
import {skillRepository} from "../repositories/skill-repository";
import {SkillGetRes} from "../dto/skill-get-res";
import {JobGetRes} from "../dto/job-get-res";


export const getAllJob = async ():Promise<JobGetRes[]> => {
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
        const jobRepo = transactionalEntityManager.withRepository(jobRepository);

        const allJob = await jobRepo.find();

        return allJob.map(job => ({
            name : job.name
        }));
    });
}
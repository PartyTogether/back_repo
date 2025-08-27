import { AppDataSource } from "../data-source";
import {Job} from "../models/entities/job";

const seedJob = async () => {
    await AppDataSource.initialize();
    const jobRepo = AppDataSource.getRepository(Job);

    const jobs = [
        {name:"히어로"},
        {name:"다크나이트"},
        {name:"팔라딘"},
        {name:"아크메이지(불,독)"},
        {name:"아크메이지(썬,콜)"},
        {name:"비숍"},
        {name:"나이트로드"},
        {name:"섀도어"},
        {name:"보우마스터"},
        {name:"신궁"},
        {name:"캡틴"},
        {name:"바이퍼"},
        {name:'공용'}
    ]

    const existing = await jobRepo.find({where: jobs,});
    const existingNames = new Set(existing.map(j => j.name));
    const newJobs = jobs
        .filter(j => !existingNames.has(j.name))
        .map(j => jobRepo.create(j));

    if(newJobs.length > 0){
        await jobRepo.save(newJobs);
        console.log("직업시드 생성완료");
    }else{
        console.log("직업시드 생성실패 이미 존재하는 데이터들입니다");
    }
    process.exit(0);
}

seedJob().catch((err) => {
    console.log("직업시드 생성실패",err);
    process.exit(1);
})
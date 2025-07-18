import {AppDataSource} from "../data-source";
import { Skill } from '../models/entities/skill';
import {Job} from "../models/entities/job";


const skills: Record<string, {name:string, master_level:number, image: string}[]> = {
    '나이트로드' : [
        {
            name : '트리플스로우',
            master_level : 30,
            image : '',
        },
        {
            name : '베놈',
            master_level : 30,
            image : '',
        },
        {
            name : '메소업',
            master_level : 20,
            image : '',
        },
        {
            name : '헤이스트',
            master_level : 20,
            image : '',
        },
    ],
    '보우마스터' : [
        {
            name : '샤프아이즈',
            master_level : 30,
            image : '',
        },
        {
            name : '폭풍의시',
            master_level : 30,
            image : '',
        },
        {
            name : '집중',
            master_level : 30,
            image : '',
        },
    ],
    '공용' : [
        {
            name : '메이플용사',
            master_level : 30,
            image : '',
        },
    ]
}

const seedSkill = async() => {
    await AppDataSource.initialize();

    const skillRepo = AppDataSource.getRepository(Skill);
    const jobRepo = AppDataSource.getRepository(Job);

    for( const [jobName, skill] of Object.entries(skills)){
        console.log(jobName);
        const job = await jobRepo.findOneBy({ name : jobName });
        if(!job){
            console.warn(`직업${jobName} 이 존재하지 않아 건너뜀`);
            continue;
        }

        const names = skill.map(s => s.name);
        const existing = await skillRepo.find({
            where : names.map(name => ({ name }))
        })

        const existingNames = new Set(existing.map(s => s.name));

        const newSkills = skill
            .filter(s => !existingNames.has(s.name))
            .map(s => skillRepo.create({...s, job}));

        if(newSkills.length > 0){
            await skillRepo.save(newSkills);
            console.log(` ${jobName} 에 ${newSkills.length}개의 스킬 추가`);
        }else {
            console.log(` ${job}에는 이미 존재하는 스킬들입니다.`);
        }

    }
    process.exit(0);
}
seedSkill().catch((err) => {
    console.log('스킬 시드 실패:',err);
    process.exit(1);
})
import {AppDataSource} from "../data-source";
import { Skill } from '../models/entities/skill';
import {Job} from "../models/entities/job";


const skills: Record<string, {name:string, masterLevel:number, image: string}[]> = {
    '히어로' : [
        {
            name : '분노',
            masterLevel : 20,
            image : '',
        },
        {
            name : '브랜디쉬',
            masterLevel : 30,
            image : '',
        },
    ],
    '다크나이트' : [
        {
            name : '하이퍼바디',
            masterLevel : 30,
            image : '',
        },
        {
            name : '스피어버스터',
            masterLevel : 30,
            image : '',
        },
        {
            name : '드래곤로어',
            masterLevel : 30,
            image : '',
        },
        {
            name : '버서크',
            masterLevel : 30,
            image : '',
        }
    ],
    '아크메이지(불,독)' : [
        {
            name : '익스플로전',
            masterLevel : 30,
            image : '',
        },
        {
            name : '패럴라이즈',
            masterLevel : 30,
            image : '',
        },
    ],
    '아크메이지(썬,콜)' : [
        {
            name : '아이스스트라이크',
            masterLevel : 30,
            image : '',
        },
        {
            name : '체인라이트닝',
            masterLevel : 30,
            image : '',
        },
    ],
    '비숍' : [
        {
            name : '힐',
            masterLevel : 30,
            image : '',
        },
        {
            name : '홀리심볼',
            masterLevel : 30,
            image : '',
        },
        {
            name : '블레스',
            masterLevel : 20,
            image : '',
        },
        {
            name : '미스틱도어',
            masterLevel : 20,
            image : '',
        },
        {
            name : '리저렉션',
            masterLevel : 10,
            image : '',
        },
        {
            name : '제네시스',
            masterLevel : 30,
            image : '',
        },
    ],
    '보우마스터' : [
        {
            name : '샤프아이즈',
            masterLevel : 30,
            image : '',
        },
        {
            name : '폭풍의시',
            masterLevel : 30,
            image : '',
        },
        {
            name : '집중',
            masterLevel : 30,
            image : '',
        },
    ],
    '신궁' : [
        {
            name : '샤프아이즈',
            masterLevel : 30,
            image : '',
        },
        {
            name : '크로스보우엑스퍼트',
            masterLevel : 30,
            image : '',
        },
    ],
    '나이트로드' : [
        {
            name : '트리플스로우',
            masterLevel : 30,
            image : '',
        },
        {
            name : '베놈',
            masterLevel : 30,
            image : '',
        },
        {
            name : '메소업',
            masterLevel : 20,
            image : '',
        },
        {
            name : '헤이스트',
            masterLevel : 20,
            image : '',
        },
    ],
    '섀도어' : [
        {
            name : '헤이스트',
            masterLevel : 20,
            image : '',
        },
        {
            name : '메소익스플로전',
            masterLevel : 30,
            image : '',
        },
        {
            name : '베놈',
            masterLevel : 30,
            image : '',
        },
        {
            name : '부메랑스텝',
            masterLevel : 30,
            image : '',
        },
    ],
    '공용' : [
        {
            name : '메이플용사',
            masterLevel : 30,
            image : '',
        },
        {
            name : '용사의의지',
            masterLevel : 5,
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
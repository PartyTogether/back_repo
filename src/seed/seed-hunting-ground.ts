import { AppDataSource } from '../data-source';
import { HuntingGround } from "../models/entities/hunting-ground";
import {Continent} from "../models/entities/continent";
import {HuntingGroundType} from "../models/entities/hunting-ground-type";

// seed 데이터
const huntingGroundMap: Record<string, { name: string; rec_level: number; type: HuntingGroundType }[]> = {
    '리프레' : [
        {   name: '망가진 용의 둥지',
            rec_level:110,
            type: HuntingGroundType.Hunting,
        },
        {   name: '위험한 용의 둥지',
            rec_level:110,
            type: HuntingGroundType.Hunting,
        },
        {   name: '큰 둥지 봉우리',
            rec_level:110,
            type: HuntingGroundType.Hunting,
        },
        {   name: '남겨진 용의 둥지',
            rec_level:110,
            type: HuntingGroundType.Hunting,
        },
        {   name: '죽은 용의 둥지',
            rec_level:110,
            type: HuntingGroundType.Hunting,
        },
        {   name: '블루 와이번의 둥지',
            rec_level:110,
            type: HuntingGroundType.Hunting,
        },
        {   name: '협곡의 동쪽길',
            rec_level:110,
            type: HuntingGroundType.Hunting,
        },
    ],
    '루디브리엄':[
        {   name: '시간의 길1',
            rec_level:35,
            type: HuntingGroundType.Hunting,
        },
        {   name: '시간의 길4',
            rec_level:45,
            type: HuntingGroundType.Hunting,
        },
        {   name: '삐뚤어진 시간',
            rec_level:80,
            type: HuntingGroundType.Hunting,
        },
        {   name: '사라진 시간',
            rec_level:80,
            type: HuntingGroundType.Hunting,
        },
    ]
};


const seedHuntingGround = async () => {
    await AppDataSource.initialize();

    const continentRepo = AppDataSource.getRepository(Continent);
    const hgRepo = AppDataSource.getRepository(HuntingGround);

    // 대륙이름, 사냥터 분류
    for (const [continentName, grounds] of Object.entries(huntingGroundMap)) {
        const continent = await continentRepo.findOneBy({ name: continentName });
        if (!continent) {
            console.warn(`대륙 '${continentName}' 이 존재하지 않아 건너뜀`);
            continue;
        }

        // 사냥터 이름 기준 이미 있으면 추가 x
        const names = grounds.map(g => g.name);
        const existing = await hgRepo.find({
            where: names.map(name => ({ name })),
        });
        const existingNames = new Set(existing.map(g => g.name));

        const newGrounds = grounds
            .filter(g => !existingNames.has(g.name))
            .map(g => hgRepo.create({ ...g, continent }));

        if (newGrounds.length > 0) {
            await hgRepo.save(newGrounds);
            console.log(` ${continentName}에 ${newGrounds.length}개 사냥터 추가`);
        } else {
            console.log(` ${continentName}에는 이미 모든 사냥터가 존재`);
        }
    }

    process.exit(0);
};

seedHuntingGround().catch((err) => {
    console.error('사냥터 시드 실패:', err);
    process.exit(1);
});
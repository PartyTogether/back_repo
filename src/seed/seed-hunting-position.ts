import {AppDataSource} from "../data-source";
import {HuntingGround} from "../models/entities/hunting-ground";
import {HuntingPosition} from "../models/entities/hunting-position";

const huntingGroundPosition: Record<string, {position1: string,position2: string,position3: string,position4: string,position5: string,position6: string,}> = {
    '망가진 용의 둥지': {
        position1:'1좌',
        position2:'2좌',
        position3:'1우',
        position4:'2우',
        position5:'3층',
        position6:'서폿'
    },
    '큰 둥지 봉우리': {
        position1:'1좌',
        position2:'1중',
        position3:'1우',
        position4:'3층',
        position5:'',
        position6:'서폿'
    }
}

const seedHuntingPosition = async() => {
    await AppDataSource.initialize();

    const hgRepo = AppDataSource.getRepository(HuntingGround);
    const hpRepo = AppDataSource.getRepository(HuntingPosition);

    for(const [huntingGroundName, position] of Object.entries(huntingGroundPosition)) {
        const huntingGround = await hgRepo.findOneBy({ name: huntingGroundName });
        console.log("사냥터 :",huntingGroundName);
        if (!huntingGround) {
            console.warn(`대륙 '${huntingGroundName}' 이 존재하지 않음`);
            continue;
        }
        const existingPosition = await hpRepo.findOneBy({ huntingGround: { id: huntingGround.id } });
        if (existingPosition) {
            console.warn(`사냥터 '${huntingGroundName}' 에 대한 포지션이 이미 존재함`);
            continue;
        }

        const newPosition = hpRepo.create({
            huntingPosition1: position.position1,
            huntingPosition2: position.position2,
            huntingPosition3: position.position3,
            huntingPosition4: position.position4,
            huntingPosition5: position.position5,
            huntingPosition6: position.position6,
            huntingGround
        });
        await hpRepo.save(newPosition);
    }
    process.exit(0)
}

seedHuntingPosition()
    .then(() => console.log("사냥터 사냥 포지션 시드데이터 등록 완료."))
    .catch((error) => {
        console.error("등록 실패:", error)
        process.exit(1);
    });

import { Continent } from '../models/entities/continent';
import { AppDataSource } from '../data-source';

const seedContinent = async () => {
    await AppDataSource.initialize();

    const continentRepo = AppDataSource.getRepository(Continent);

    const continents = [
        { name: '빅토리아', image: ''},
        { name: '엘나스', image: ''},
        { name: '리프레', image: ''},
        { name: '아쿠아리움', image: ''},
        { name: '루디브리엄', image: ''},
        { name: '해외여행', image: ''},
        { name: '무릉도원', image: ''},
    ];

    for (const continent of continents){
        await continentRepo.save(continentRepo.create(continent));
    }

    console.log('대륙 시드 생성 완료!');
    process.exit(0);

};

seedContinent().catch((err) => {
    console.error('시드 생성 실패',err);
    process.exit(1);
})


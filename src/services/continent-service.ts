import { ContinentsRes } from "../dto/continents-res";
import {getAllContinentsWithGrounds} from "../repositories/continent-repository";



export const getFormattedContinentsWithGrounds = async(): Promise<ContinentsRes[]> => {
    const continents = await getAllContinentsWithGrounds();

    return continents.map(continent => ({
        continent:continent.name,
        continentImage: continent.image,
        huntingGrounds: continent.huntingGrounds.map(h => h.name),
    }));
};
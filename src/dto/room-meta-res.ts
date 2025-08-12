export interface HuntingGroundRes {
    huntingGroundName: string;
    positions: string[];
}

export interface Continent {
    continentName: string;
    continentImage: string;
    huntingGrounds: HuntingGroundRes[];
}

export interface RoomMetaRes {
    continents: Continent[];
    isLoggedIn: boolean;
    hasRoom: boolean;
}

export interface HuntingGroundRes {
    huntingGroundName: string;
    positions: string[];
}

export interface Continent {
    continentName: string;
    continentImage: string | null;
    huntingGrounds: HuntingGroundRes[];
}

export interface RoomMetaRes {
    continents: Continent[];
    isLoggedIn: boolean;
    hasRoom: boolean;
}

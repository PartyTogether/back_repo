export interface HuntingGroundRes {
    huntingGroundName: string;
    positions: string[];
}

export interface RoomMetaRes {
    continentName: string;
    continentImage: string;
    huntingGrounds: HuntingGroundRes[];
}

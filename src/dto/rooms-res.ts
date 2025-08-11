export interface Room {
    roomId: string;
    roomTitle: string;
    roomDesc: string | null
    roomContinent: string;
    roomHuntingGround: string;
    roomHost: string;
    roomCurrentMembers: number;
    roomMaxMembers: number;
    roomChannel: string | null;
    roomMinLevel: number;
    roomMinTime: string;
}
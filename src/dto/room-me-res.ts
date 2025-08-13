export interface memberSkill{
    skillName: string;
    skillImage: string;
    memberSkillLevel: number;
}

export interface member {
    memberId: string;
    memberName: string;
    memberLevel: number | null;
    memberClass: string;
    memberSkills: memberSkill[];
}

export interface roomPosition{
    positionName: string;
    positionStatus: string;
    positionComment: string;
    member: member | null;
}

export interface selectedRoom {
    roomId: string;
    roomTitle: string;
    roomDesc: string | null;
    roomMembers: member[];
    roomHost: string;
    roomCurrentMembers: number;
    roomMaxMembers: number;
    roomChannel: string | null;
    roomMinLevel: number;
    roomMinTime: string;
    roomPositions: roomPosition[];
}

export interface ApplicantRes {
    applicantId: string;
    memberId: string;
    memberName: string;
    memberLevel: number | null;
    memberClass: string;
    positionName: string;
    memberSkills: memberSkill[];
}

export interface memberSkill{
    skillName: string;
    skillImage: string | null;
    memberSkillLevel: number;
}
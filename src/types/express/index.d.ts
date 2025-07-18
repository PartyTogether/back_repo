import { MemberInfo } from "../discordMember";

declare global {
    namespace Express {
        interface Request {
            member: MemberInfo;
        }
    }
}

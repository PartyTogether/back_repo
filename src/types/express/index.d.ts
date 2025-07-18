import {MemberInfo} from "../discorduser";

declare global {
    namespace Express {
        interface Request {
            member: MemberInfo;
        }
    }
}

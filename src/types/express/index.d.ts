import { MemberInfo } from "../discord-member";

declare global {
    namespace Express {
        interface Request {
            member: MemberInfo;
        }
    }
}

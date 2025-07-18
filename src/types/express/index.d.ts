import { MemberInfo } from "../membertypes";

declare global {
    namespace Express {
        interface Request {
            member: MemberInfo;
        }
    }
}

import { MemberInfo } from "../discord-member";

declare module 'express-serve-static-core' {
    interface Request {
        member: MemberInfo;
    }
}
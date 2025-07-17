import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwtutil";

// 사용자 토큰을 검증하고 성공 시 Token의 Payload를 req.user에 적용
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    // 토큰 없을 시
    if (!token) {
        return res.status(411).json({ message: "Access Token이 없습니다." });
    }

    // 토큰 검증 성공 시 Payload를 req.user에 저장 후 다음 middleware로 진행
    try {
        req.user = verifyAccessToken(token);
        next();
    } catch (err) {
        return res.status(403).json({ message: "유효하지 않은 Access Token입니다." });
    }
};
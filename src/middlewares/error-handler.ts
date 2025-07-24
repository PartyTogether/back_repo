import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err); // 에러 로그 출력

    const statusCode = err.statusCode || 500;  // 커스텀 에러가 없으면 500
    const message = err.message || '서버 오류가 발생했습니다.';

    res.status(statusCode).json({ message });
}
export class ClientError extends Error {
    statusCode: number;

    constructor(statusCode: number = 400, message?: string) {
        super(message || '클라이언트 요청 에러');
        this.statusCode = statusCode;

        // 에러 이름을 상태코드로 설정 주로 개발자들이 사용하는 코드 랍니다.
        this.name = `ClientError ${statusCode}`;

        Error.captureStackTrace(this, this.constructor);
    }
}
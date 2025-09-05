import express from "express";
import * as dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from './data-source';
import 'reflect-metadata';
import oauthRouter from './router/auth-router';
import continentRouter from './router/continent-router';
import roomRouter from './router/room-router';
import memberRouter from './router/member-router';
import cors from 'cors';
import {errorHandler} from "./middlewares/error-handler";
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { webSocketService } from './services/web-socket-service';
import url from 'url';
import * as cookie from 'cookie';
import { verifyAccessToken } from './utils/jwt-util';
import skillRouter from "./router/skill-router";
import jobRouter from "./router/job-router";

const app = express();
const PORT = process.env.PORT || 5000;

// 실행시 DB 연결 및 라우터 설정
AppDataSource.initialize()
    .then(async () => {
        console.log('DB 연결 성공');

        const server = createServer(app);
        const wss = new WebSocketServer({ noServer: true });

        // cors 설정 최상단둬야함
        app.use(cors({
            origin: 'http://localhost:3000',
            credentials: true,
        }));
        // 그다음 쿠키parser및  request.body를 받기위한 세팅
        app.use(express.json());
        app.use(cookieParser());

        // 라우터들
        app.use('/auth', oauthRouter);
        app.use('/api/member', memberRouter);
        app.use('/api/skill', skillRouter);
        app.use('/api/job', jobRouter);
        app.use('/api/room',roomRouter);
        app.use('/api/continents',continentRouter);

        app.use(errorHandler);

        server.on('upgrade', (request, socket, head) => {
            const pathname = request.url ? url.parse(request.url).pathname : '';

            const roomMatch = pathname?.match(/^\/ws\/rooms\/([0-9a-fA-F-]+)$/);
            const userMatch = pathname?.match(/^\/ws\/member$/);

            if (roomMatch) {
                const roomId = roomMatch[1];
                wss.handleUpgrade(request, socket, head, (ws) => {
                    webSocketService.handleConnection(ws, roomId);
                });
            } else if (userMatch) {
                try {
                    const cookies = cookie.parse(request.headers.cookie || '');
                    const accessToken = cookies.access_token;
                    if (!accessToken) {
                        throw new Error('인증 토큰이 없습니다.');
                    }

                    const memberInfo = verifyAccessToken(accessToken);
                    if (!memberInfo || !memberInfo.id) {
                        throw new Error('유효하지 않은 토큰입니다.');
                    }
                    const memberId = memberInfo.id;

                    wss.handleUpgrade(request, socket, head, (ws) => {
                        webSocketService.handleMemberConnection(ws, memberId);
                    });
                } catch (error: any) {
                    console.error('웹소켓 인증 실패:', error.message);
                    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                    socket.destroy();
                }
            } else {
                socket.destroy();
            }
        });

        server.listen(PORT, () => {
            console.log(`Example app listening on port ${PORT}`)
        });
    }).catch((err) => {
    console.error('DB 연결 실패:',err);
});
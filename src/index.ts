import express , { Request, Response } from "express";
import * as dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from './data-source';
import 'reflect-metadata';
import oauthRouter from './router/auth-router';
import continentRouter from './router/continent-router';
import roomRouter from './router/room-router';
import cors from 'cors';
import {errorHandler} from "./middlewares/error-handler";
import cookieParser from 'cookie-parser';

const app = express()
const PORT = process.env.PORT || 5000;

// 실행시 DB 연결 및 라우터 설정
AppDataSource.initialize()
    .then(() => {
        console.log('DB 연결 성공');

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
        app.use('/api/room',roomRouter);
        app.use('/api/continents',continentRouter);


        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Example app listening on port ${PORT}`)
        });
    }).catch((err) => {
    console.error('DB 연결 실패:',err);
});
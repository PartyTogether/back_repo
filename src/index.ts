import express , { Request, Response } from "express";
import * as dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from './data-source';
import 'reflect-metadata';
import oauthRouter from './router/authRouter';
import continentRouter from './router/continent-router';
import cors from 'cors';

const app = express()
const PORT = process.env.PORT || 5000;

// 실행시 DB 연결 및 라우터 설정
AppDataSource.initialize()
    .then(() => {
        console.log('DB 연결 성공');

        app.use('/auth', oauthRouter);

        app.use(cors({
            origin: 'http://localhost:3000',
            credentials: true,
        }));

        app.use('/api/continents',continentRouter);
        app.listen(PORT, () => {
            console.log(`Example app listening on port ${PORT}`)
        });
    }).catch((err) => {
    console.error('DB 연결 실패:',err);
});
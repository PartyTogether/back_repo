import express , { Request, Response } from "express";
import * as dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from './data-source';
import 'reflect-metadata';
import authRouter from "./router/auth-router";

const app = express()
const PORT = process.env.PORT || 5000;

// 실행시 DB 연결 및 라우터 설정
AppDataSource.initialize()
    .then(() => {
        console.log('DB 연결 성공');

        app.get('/', (req: Request, res: Response) => {
            res.send('<h1>Hello World!</h1>')
        });

        app.use('/auth', authRouter);

        app.listen(PORT, () => {
            console.log(`Example app listening on port ${PORT}`)
        });
    }).catch((err) => {
    console.error('DB 연결 실패:',err);
});
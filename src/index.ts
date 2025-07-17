import express , { Request, Response } from "express";
import * as dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from './data-source';
import 'reflect-metadata';
import oauthRouter from './router/oauthRouter';

const app = express()
const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
    .then(() => {
        console.log('DB 연결 성공');

        app.get('/', (req: Request, res: Response) => {
            res.send('<h1>Hello World!</h1>')
        });

        app.use('/auth', oauthRouter);

        app.listen(PORT, () => {
            console.log(`Example app listening on port ${PORT}`)
        });
    }).catch((err) => {
    console.error('DB 연결 실패:',err);
});

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Hello World!</h1>')
});

app.use('/auth', oauthRouter, );

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
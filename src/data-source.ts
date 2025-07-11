
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname+'/models/entities/*.ts'],  // dir 은 현재 파일경로기준
    synchronize: true, // 개발 시 true: 자동 테이블 생성 및 스프링에 update 랑 같음
    logging: true,
});
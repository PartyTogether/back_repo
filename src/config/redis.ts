import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

let redisClient: RedisClientType | null = null;

// Redis 클라이언트 생성 함수
export const getRedisClient = async (): Promise<RedisClientType> => {
    if (!redisClient) {
        redisClient = createClient({
            url: process.env.REDIS_URL || 'redis://127.0.0.1:6100',
        });

        redisClient.on('error', (err) => {
            console.error('❌ Redis 연결 오류:', err);
        });

        await redisClient.connect();
        console.log('✅ Redis 연결 완료');
    }

    return redisClient;
};
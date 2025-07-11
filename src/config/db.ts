import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,   // 풀에 커넥션이 없으면 요청 대기 여부
    connectionLimit: 10,        // 커넥션은 10개까지 제공 11개부터는 대기
    queueLimit: 0,              // 대기열 최대 길이 0 이면 무제한
})

export default pool;
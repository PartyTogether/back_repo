import express , { Request, Response } from "express";
import * as dotenv from 'dotenv';
dotenv.config();
import oauthRouter from './router/oauthRouter';

const app = express()
const PORT = 5000


app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Hello World!</h1>')
});

app.use('/auth', oauthRouter);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
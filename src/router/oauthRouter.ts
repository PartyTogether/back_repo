import express, {Request, Response} from "express";
import {discordCallback, discordLogin, refreshTokens} from "../controller/userController";

const router = express.Router();

router.get('/discord', discordLogin);

router.get('/discord/callback', discordCallback);

router.post('/refresh', refreshTokens);

export default router;
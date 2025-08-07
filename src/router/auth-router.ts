import express, { Request, Response } from "express";
import {authMe, discordCallback, discordLogin} from "../controllers/member-controller";
import {authenticateToken} from "../middlewares/authenticate-token";

const router = express.Router();

router.get('/discord', discordLogin);

router.get('/discord/callback', discordCallback);

router.get('/auth/me', authenticateToken, authMe);

export default router;
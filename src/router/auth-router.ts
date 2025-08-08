import { Router } from "express";
import {authLogout, authMe, discordCallback, discordLogin} from "../controllers/member-controller";
import {authenticateToken} from "../middlewares/authenticate-token";

const router = Router();

router.get('/discord', discordLogin);

router.get('/discord/callback', discordCallback);

router.get('/me', authenticateToken, authMe);

router.get('/logout', authenticateToken, authLogout);

export default router;
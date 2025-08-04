import express, { Request, Response } from "express";
import {discordCallback, discordLogin } from "../controllers/member-controller";

const router = express.Router();

router.get('/discord', discordLogin);

router.get('/discord/callback', discordCallback);

export default router;
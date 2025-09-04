import express, {Request, Response, Router} from "express";
import session from 'express-session';
import {authenticateToken} from "../middlewares/authenticate-token";
import {getMember, getMemberIdController} from "../controllers/member-controller";

const router = express.Router();

router.get("", authenticateToken, getMember);

router.get("/id",authenticateToken, getMemberIdController);

export default router;
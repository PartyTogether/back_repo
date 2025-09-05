import express, {Request, Response, Router} from "express";
import session from 'express-session';
import {authenticateToken} from "../middlewares/authenticate-token";
import {getMember, updateMember} from "../controllers/member-controller";
import {getSkills} from "../controllers/skill-controller";

const router = express.Router();

router.get("", authenticateToken, getSkills);

export default router;
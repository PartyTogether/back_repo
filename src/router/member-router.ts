import express, {Request, Response, Router} from "express";
import session from 'express-session';
import {authenticateToken} from "../middlewares/authenticate-token";
import {getMember, getMemberIdController, updateMember} from "../controllers/member-controller";


const router = express.Router();

router.get("", authenticateToken, getMember);
router.put("", authenticateToken, updateMember);

router.get("/id",authenticateToken, getMemberIdController);

export default router;
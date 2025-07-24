import express from 'express';
import { createRoomController } from "../controllers/room-controller";
import {authenticateToken} from "../middlewares/authenticate-token";

const router = express.Router();

router.post('/create',authenticateToken,createRoomController);

export default router;
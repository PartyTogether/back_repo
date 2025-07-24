import express from 'express';
import {createRoomController, getRoomMetaController} from "../controllers/room-controller";
import {authenticateToken} from "../middlewares/authenticate-token";

const router = express.Router();

router.post('/create',authenticateToken,createRoomController);

router.get('/meta',getRoomMetaController)

export default router;
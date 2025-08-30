import express from 'express';
import {
    applyRoomController,
    createRoomController,
    getMyRoomController,
    getRoomMetaController,
    getRoomsController,
    joinRoomController,
    leaveRoomController
} from "../controllers/room-controller";
import {authenticateToken} from "../middlewares/authenticate-token";
import {optionalAuthenticateToken} from "../middlewares/optional-authenticate-token";

const router = express.Router();

router.post('/create',authenticateToken ,createRoomController);

router.get('/meta', optionalAuthenticateToken, getRoomMetaController);

router.get('/rooms',getRoomsController);

router.get('/me',authenticateToken, getMyRoomController);

router.post("/apply",authenticateToken, applyRoomController);

router.post('/apply/accept', authenticateToken, joinRoomController);

router.post('/leave', authenticateToken, leaveRoomController);

export default router;
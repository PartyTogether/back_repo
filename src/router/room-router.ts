import express from 'express';
import {createRoomController, getRoomMetaController, getRoomsController} from "../controllers/room-controller";
import {authenticateToken} from "../middlewares/authenticate-token";
import {optionalAuthenticateToken} from "../middlewares/optional-authenticate-token";

const router = express.Router();

router.post('/create',authenticateToken ,createRoomController);

router.get('/meta', optionalAuthenticateToken, getRoomMetaController);

router.get('/rooms',getRoomsController);

export default router;
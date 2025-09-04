import express from 'express';
import { authenticateToken } from '../middlewares/authenticate-token';
import {sendMessageController} from "../controllers/message-controller";
const router = express.Router();

router.post('/send',authenticateToken,sendMessageController);

export default router;
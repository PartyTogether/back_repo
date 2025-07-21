import express from "express";
import {getAllContinentsWithGrounds} from "../controllers/continent-controller";


const router = express.Router();

router.get('/', (getAllContinentsWithGrounds));

export default router;


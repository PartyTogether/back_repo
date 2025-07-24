import express, {Request,Response} from "express";
import {getFormattedContinentsWithGrounds} from "../services/continent-service";

export const getAllContinentsWithGrounds = async(_: Request, res: Response) => {
    try{
        const data = await getFormattedContinentsWithGrounds();
        res.status(200).json(data);
    } catch (error){
        console.error("예기치 못한 오류가 발생했습니다.",error);
        res.status(400).json({message:'잘못된 요청입니다.'})
    }
}

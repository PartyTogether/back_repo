import {AppDataSource} from "../data-source";
import {application} from "express";

export const applicantRepository = AppDataSource.getRepository(application).extend({

});
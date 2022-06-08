import { NextFunction, Request ,Response } from "express";
import { pick } from "../utils/pick";
import * as Joi from "joi";


export const validate = (schema:any)=>async(req:Request,res:Response,next:NextFunction)=>{
    const validSchema = pick(schema,['params','query','body']);
    const object = pick(req, Object.keys(validSchema));
    const schemaComplie = Joi.compile(validSchema);
    try {
        const {value, error} = await schemaComplie.validate(object);
        if(error) {
            const errorMessage = error.details.map((details:any)=>details.message).join(', ')
            return res.status(400).json({
                result: false,
                message: errorMessage
            });
        }
        Object.assign(req,value);
        return next()
    }
    catch (err) {
        return res.status(401).json(err);
    }
}


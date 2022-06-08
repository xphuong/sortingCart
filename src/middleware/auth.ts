
import { NextFunction, Request, RequestHandler, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getkey } from "../auth/token.config";
import { TokenType } from "../helper/enum/tokenType.enum";
import User from "../user/User.entity";
import { ErrorResponse } from "../utils/ErrorResponse";

interface UserPayload{
    id: number,
    role: string
}

declare global{
    namespace Express {
        interface Request{
            user?: UserPayload
        }
    }
}

export const checkAuth= async(req:Request,res:Response, next:NextFunction)=> {
    try {
        //Bearer accToken
        const authHeader = req.header('Authorization');
        const accessToken = authHeader && authHeader.split(' ')[1];
        
        if(!accessToken)
        return res.status(403).json({
            result: false,
            message: "Not authenticated"
        })
    
        // verify Token
        const verifyToken:any = jwt.verify(accessToken, getkey(TokenType.ACCESS_TOKEN)) as UserPayload;
        const id = verifyToken.id;
            
        //Check if user still exists
        const currentUser = await User.findOne({where:{id}});
        
        if(!currentUser){
            return res.status(401).json({
                result: false,
                message: "The user belonging to this token does no longer exist"
            })
        }

        req.user = currentUser;
        res.locals.user = currentUser
        return next();

    } catch (error) {
        return res.status(401).json({
            result: false,
            message: 'Error authenticating user'
        });
    }
};


export const checkRole =(roles: Array<string>)=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        const userrole:any = req.user;
        if(!roles.includes(userrole.role)){
            return res.status(403).json(`User role ${userrole.role} is not authorized to access`);
        }
        next();
    }
}
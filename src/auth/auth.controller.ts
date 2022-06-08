import { Response,Request, RequestHandler } from "express"
import User from "../user/User.entity";
import bcrypt from "bcrypt"
import { AppDataSource } from "../config/db";
import { Repository } from "typeorm";
import { genAuthToken, refreshToken } from "./token.service";
import Token from "./token.entity";

const salt = 10

export const register:RequestHandler = async (req: Request,res: Response): Promise<Response>=> {
    try{
        const email: string = req.body.email
        const pw = req.body.password
        var hashpw = await bcrypt.hash(pw, salt);
        const user: any = await User.findOne({where:{email}})
        if (!user) {
            const userRepository: Repository<User> = AppDataSource.getRepository(User);
            const newUser = await User.create({
                email: email,
                password: hashpw,
                name: req.body.name
            })
            await userRepository.save(newUser);
            return res.status(200).json({
                result: true,
                message: 'Create User Successfully'
            });
        }else {
            return res.status(401).json({
                result: false,
                message: 'User is already exist'
            });
        }; 
    }
    catch(err){
        return res.status(403).json({
            result: false,
            message: err
        });
    }
};



export const login :RequestHandler = async (req: Request,res: Response)=> {
    try{
        const email:any = req.body.email 
        const user:any = await User.findOne({where: {email}})
        if(!user) {
            return res.status(401).json({
                result: false,
                message: "Invalid email"
            });
        } else {
            var pw: string = req.body.password
            await bcrypt.compare(pw, user.password, async (err: any, result: any) => {
                if(result) {
                    const newToken: Object = await genAuthToken(user);
                    return res.status(200).json({
                        result: true,
                        message: newToken
                    });
                } else {
                    return res.status(401).json({
                        result: false,
                        message: "Invalid password"
                    });
                }
            })
        }
    }
    catch(err){
        return res.json({
            result: false,
            message: err
        })
    }
}


export const logout :RequestHandler = async (req:Request, res:Response) => {
    const tokenRepository: Repository<Token> = AppDataSource.getRepository(Token);
    await tokenRepository.delete({ token: req.body.refreshToken });
    res.json({
        result: true,
        message: "logout ok!!!"
    })
}

export const tokenRefresh:RequestHandler = async (req:Request, res:Response) => {
    try{
        let refrToken = req.body.refreshToken
        let user = req.user?.id
        let ret = await refreshToken(refrToken, user)
        return res.json(ret)
    }
    catch(err){
        return res.json({
            result: false,
            message: err
        })
    }
}
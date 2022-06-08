import { Request,Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/db";
import bcrypt from "bcrypt"
import User from "./User.entity";


    //GET admin/manage/user/:id
export const getUser = async (req:Request, res:Response):Promise<Response>=>{
    const id = parseInt(req.params.id);
    const userRepository:Repository<User> = AppDataSource.getRepository(User);
    const user:any = await userRepository.findOne({where:{id}});
    if(!user){
        return res.status(404).json({
            result: false,
            message:"User is not exist"
        })
    }
    return res.status(200).json({
        result:true,
        message:user
    })
}


//PUT admin/manage/user/:id/edit
export const updateUser = async (req:Request, res:Response)=>{
    const id = parseInt(req.params.id);
    const {name,email,role, password}:
    {name:string,email:number,password:string,role:any} = req.body;
    const userRepository:Repository<User> = AppDataSource.getRepository(User);
    const user:any = await userRepository.findOneBy({id});
    if(!user){
        return res.status(404).json({
            result: false,
            message:"User is not exist"
        })
    }
    if(password){
        user.password= await bcrypt.hash(password,8);
    }
    if(name){
        user.name = name;
    }
    if(email){
        user.email = email; 
    }
    if(role){
        user.role =role;
    }
    await userRepository.save(user);
    return res.status(200).json({
        success: true,
        message: 'Success',
        data:user
    })
}


//DELETE admin/manage/user/:id/delete
export const deleteUser=async (req:Request, res:Response):Promise<Response>=>{
    const id = parseInt(req.params.id);
    try {
        const userRepository:Repository<User> = AppDataSource.getRepository(User);
        const user:any = await userRepository.findOneBy({id});
        if(!user){
                return res.status(404).json({
                    success: false,
                    message:"User is not exist"
                })
        }
        await userRepository.remove(user);
        return res.status(200).json({
            success: true,
            message: "Delete user successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message:error
        })    
    }
}
import { NextFunction, Request ,Response } from "express";
import { AppDataSource } from "../config/db";

export const advancedResults = (model:any) => async(req:Request,res:Response,next:NextFunction)=>{
  
    const modelRepository =  AppDataSource.getRepository(model);
    // const products = await modelRepository.find();
    const builder = modelRepository.createQueryBuilder('product');

    if(req.query.s){
        builder.where("product.name LIKE :s or product.review LIKE :s",{s:`%${req.query.s}%`})
    }

    const sort: any = req.query.sort;

    if(sort){
        builder.orderBy('product.price',sort.toUpperCase());
    }

    const page:number = parseInt(req.query.page as any)|| 1;
    const limit: number = parseInt(req.query.limit as any)||1;

    const startIndex = (page-1)*limit;
    const total = await builder.getCount();
    builder.offset(startIndex).limit(limit);
    const results = await builder.getMany();


     res.json({
        success: true,
        total,
        page,
        last_page: Math.ceil(total/limit),
        data: results
    })
    return next();

}

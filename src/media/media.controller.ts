import { NextFunction, Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/db";
import Product  from "../product/Product.entity";
import { ICreateMediaDTO } from "./ICreateMedia";
import Media from "./Media.entiy";


// declare global{
//     namespace Express {
//         interface Request{
//             file?:Multer.File
//         }
//     }
// }

export const singleFileUpload = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const file:ICreateMediaDTO= Media.create({
            product:req.body.product,
            fileName: req.file?.originalname,
            filePath: req.file?.path,
            mimeType: req.file?.mimetype,
            fileSize: fileSizeFormatter(req.file?.size,2)//0.00
        })
        // console.log(file);
        
        const fileRepository:Repository<Media> = await AppDataSource.getRepository(Media);
        await fileRepository.save(file);
        const productRepository = await AppDataSource.getRepository(Product);
        const product:any = await productRepository.findOne({where:{id:req.body.product}});
        product.images.push(file);
        await productRepository.save(product);
        res.status(200).json('File Uploaded Successfully');
    } catch (error) {
        res.status(400).json(error.message);
    }
}



const fileSizeFormatter = (bytes:any,decimal:number)=>{
    if(bytes ===0){
        return '0 Bytes'
    }
    const dm = decimal ||2;
    const size =['Bytes','KB','MB'];
    const index = Math.floor(Math.log(bytes)/Math.log(1000));
    return parseFloat((bytes/Math.pow(1000,index)).toFixed(dm))+' '+size[index];
}
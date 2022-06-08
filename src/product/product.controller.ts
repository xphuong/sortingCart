
import { Request,Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/db";
import { ICreateProduct } from "./ICreatProduct";
import Product  from "./Product.entity";


    //GET manage/product
    export const getAllProduct=async(req:Request,res:Response):Promise<Response>=>{
        const page:number = parseInt(req.query.page as any)|| 1;
        const limit: number = parseInt(req.query.limit as any)||10;
        const startIndex = (page-1)*limit;
        const productRepository= AppDataSource.getRepository(Product);
        const [products,total] = await productRepository.findAndCount({relations:{images:true},take:limit,skip:startIndex,order: {
            id: "ASC",
        },
    });
        return res.status(200).json({
            results: true,
            total,
            page,
            last_page: Math.ceil(total/limit),
            data : products
        })
    }

    //POST manage/product
    export const addProduct=async (req:Request, res:Response):Promise<Response>=>{
        const {name,price,review,quantity}:
        {name:string,price:number,review:string,quantity:number} = req.body;
        const productRepository:Repository<Product> = AppDataSource.getRepository(Product);
        const product:any = await productRepository.findOne({where:{name}})
        if(product){
            return res.status(400).json({
                results: false,
                error:"Product Name is existed"
            })
        }
        if(price<0){
            return res.status(400).json({
                result: false,
                error:"Price must greater than 0"
            })
        }
        const newProduct:ICreateProduct = Product.create({
            name,
            price,
            review,
            quantity,
        })
        await productRepository.save(newProduct);
        return res.status(200).json({
            result: true,
            data: newProduct
        })
    }

    //POST manage/product/:id
export const updateProduct = async (req:Request, res:Response)=>{
    const id = parseInt(req.params.id);
    const {name,price,review,quantity}:
    {name:string,price:number,review:string,quantity:number} = req.body;
    const productRepository:Repository<Product> = AppDataSource.getRepository(Product);
    const product:any = await productRepository.findOneBy({id});
    if(!product){
        return res.status(400).json({
            result: false,
            message:"Product not exist"
        })
    }
    if(name){
        product.name = name;
    }
    if(price){
    product.price = price;

    }
    if(review){
        product.review = review;
    }
    if(quantity){
        product.quantity =quantity;
    }
    await productRepository.save(product);
    return res.status(200).json({
        result: true,
        message: 'Edit success',
        data:product
    })
}

   //DELETE manage/product/:id
export const deleteProduct=async (req:Request, res:Response):Promise<Response>=>{
    const id = parseInt(req.params.id);

    try {
        const productRepository = AppDataSource.getRepository(Product);
        const product:any = await productRepository.findOneBy({id});
        if(!product){
            return res.status(404).json({
                result: false,
                message:"Product not exist"
            })
        }
        await productRepository.remove(product);
        return res.status(200).json({
            result: true,
            message: "Delete product success"
        })
    } catch (error) {
        return res.status(500).json({
            result: false,
            message:error
        })    
    }
}


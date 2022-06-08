import { Response,Request, RequestHandler, NextFunction } from "express"
import { ErrorResponse } from "../utils/ErrorResponse";
import {} from "../auth/token.service"
import Invoice from "./invoice.entity"
import User from "../user/User.entity";
import { verifyAccess } from "../auth/token.service";
import { AppDataSource } from "../config/db";
import {Repository } from "typeorm";
import Product  from "../product/Product.entity";
import CartItem from "../cart/CartItem.entity";
import { CartStatus } from "../helper/enum/cartStatus.enum";



export const invoiceLog: RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    const user: any = req.user?.id
    if(!user) return res.status(404).json({
        result: false,
        message: "user not found"
    })
    let invoiceHistory = await Invoice.findBy({
        'user': {id: user}
    })
    return res.status(200).json({
        result: true,
        message: invoiceHistory
    })
}

export const invoiceCreate: RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    let user: any = req.user?.id
    if(!user) return res.status(404).json({
        result: false,
        message: "user not found"
    })
    let items: any = await CartItem.find({ 
        relations: ['product'] ,
        where:{
            'user': {id: user},
            status: CartStatus.UNPAID
        },
    })
    console.log( items)
    if (!items.length) return res.status(403).json({
        result: false,
        message:"Nothing in cart, pls add"
    })

    
    const invoiceRepository: Repository<Invoice> = AppDataSource.getRepository(Invoice);
    const cartItemRepository: Repository<CartItem> = AppDataSource.getRepository(CartItem);
    const productRepository: Repository<Product> = AppDataSource.getRepository(Product);
    
    let newInvoice: any = Invoice.create({
        user: user,
        total_price: 0,
    })
    await invoiceRepository.save(newInvoice);

    for (let i = 0; i < items.length; i++) {
        newInvoice.total_price = newInvoice.total_price + items[i].total_price;
        items[i].status = CartStatus.PAID
        items[i].invoice = newInvoice.id
        // console.log('newInvoice.id:' + newInvoice.id)
        // console.log('items.product.id :' + items[i].product.id)

        let product = await Product.findOneBy({
            id: items[i].product.id
        })
        if(!product) return res.status(403).json({
            result: false,
            message:"Cannot find product, pls check"
        })
        // console.log('product:' + product)
        product.quantity = product.quantity - items[i].quantity
        if(product.quantity<0) return res.status(403).json({
            result: false,
            message:"The remaining product has problem, pls check"
        })
        // console.log('product.quantity: ' + product.quantity)

        await cartItemRepository.save(items[i]);
        await productRepository.save(product);
    }
    await invoiceRepository.save(newInvoice);

    return res.status(200).json({
        result: true,
        message: newInvoice
    })
}



export const invoiceShow: RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    const user: any = req.user?.id
    if(!user) return res.status(404).json({
        result: false,
        message: "user not found"
    })
    const invoice: any = req.query.id
    if(!user) return res.status(404).json({
        result: false,
        message: "invoice not found"
    })
    const invoiceShow = await CartItem.find({
        where: {
            'user': {id: user},
            'invoice': {id: invoice}
        },
    })
    if(!invoiceShow.length) {
        return res.status(400).json({
            result: false,
            message: "Cannot find this invoice, pls try again!"
        })
    }
    return res.status(200).json({
        result: true,
        message: invoiceShow
    })
}
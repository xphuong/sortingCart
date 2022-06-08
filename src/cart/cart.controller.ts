import { Response,Request, RequestHandler, NextFunction } from "express"
import { itemDelete, itemLog, itemUpsert } from "./cart.service";


export const cartUpdateItem: RequestHandler = async (req:Request, res:Response) => {
    try{
        const user: any = req.user?.id
        if(!user) return res.json({
            result: false,
            message: "user not found"
        })
        console.log(user)
        const productID: any = req.body.product
        const quantity: any = req.body.quantity
        
        return res.json(await itemUpsert(productID, user, quantity))
    }
    catch (error){
        return res.status(400).json({
            result: false,
            message: error
        })
    }
}

export const cartLog: RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    try{
        let user: any = req.user?.id
        if(!user) return res.json({
            result: false,
            message: "user not found"
        })
        return res.json(await itemLog(user))
    }
    catch(error){
        return res.status(400).json({
            result: false,
            message: error
        })
    }
}

export const cartDelete: RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    try{
        let user: any = req.user?.id
        if(!user) return res.json({
            result: false,
            message: "user not found"
        })
        let item: any = req.query.item
        if(!item) return res.json({
            result: false,
            message: "item not exist"
        })
        return res.json(await itemDelete(user, item))
    }
    catch(error){
        return res.status(400).json({
            result: false,
            message: error
        })
    }
}

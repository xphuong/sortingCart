import { Repository } from "typeorm";
import { AppDataSource } from "../config/db";
import Product  from "../product/Product.entity";
import CartItem from "./CartItem.entity";
import { CartStatus } from "../helper/enum/cartStatus.enum";



export const itemUpsert: any = async (product: any, user: any, quantity: number) => {
    let productAdd: any = await Product.findOneBy({id: product})
    console.log("user: "+ user)
    if(!productAdd) return {
        result: false,
        message: "product is not exist"
    }
    if(productAdd.quantity < quantity) return {
        result: false,
        message: `the remaining product quantity is: ${productAdd.quantity}`
    }
    let price: number = productAdd.price * quantity
    const cartItemRepository: Repository<CartItem> = AppDataSource.getRepository(CartItem);

    let item = await cartItemRepository.findOne({
        relations: ['user', 'product'] ,
        where:{
            'user': {id: user},
            'product': {id: product},
            status: CartStatus.UNPAID
        }
    })
    if(!item) {

        item = await CartItem.create({
            user: user,
            product: product,
            quantity: quantity,
            total_price: price,
            status: CartStatus.UNPAID
        })
    }
    else{
        item.quantity = quantity
        item.total_price = price
    }
    await cartItemRepository.save(item);

    return {
        result: true,
        message: "update item ok"
    }
}


export const itemLog: any = async (user: any) => {
    let items = await CartItem.find({
        relations: ['product'],
        where:{
            'user': {id: user},
            status: CartStatus.UNPAID
        }
    })
    return ({
        result: true,
        message: items
    })
}


export const itemDelete: any = async (user: any, item: any) => {
    const cartItemRepository: Repository<CartItem> = AppDataSource.getRepository(CartItem);
    item = await CartItem.findOne({
        where: {
            'user': {id: user}, 
            'product': {id: item},    
        }
    })
    if(!item) return {
        result: false,
        message: "Item not exist"
    }

    await cartItemRepository.delete(item)
    return {
        result: true,
        message: "Delete ok!!!"
    }
}
import { DataSource } from "typeorm";
import Product from "../product/Product.entity";
import "reflect-metadata"
import CartItem from "../cart/CartItem.entity";
import User from "../user/User.entity";
import Media from "../media/Media.entiy";
import Invoice from "../invoice/invoice.entity";
import Token from "../auth/token.entity";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host:'localhost',
    port: 3000,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '679499',
    database: process.env.DB_NAME || 'mock2db',
    synchronize:true,
    logging: true,
    entities:[User, Product, CartItem, Media, Invoice, Token]
})

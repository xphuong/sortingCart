import "reflect-metadata";
import  Express  from "express";
import { AppDataSource } from "./config/db";
import verificatinEmailRouter from "./email/emailConfirm.route";
import productRouter from "./product/product.route";
import dotenv from "dotenv";
import authRouter from "./auth/auth.route"
import invoiceRouter from "./invoice/invoice.route"
import cartRouter from "./cart/cart.route"
import userRouter from "./user/user.route"
import path from "path";
import fileRoute from "./media/media.route"

dotenv.config();

const main = async () => {
    await AppDataSource.initialize()
    .then(()=>{
        console.log("Connect successfully");
    })
    .catch((err)=>console.log(err));
    
    const app = Express();
    
    app.use(Express.json());
    app.use(Express.urlencoded({extended:false}));
    app.use('/uploads', Express.static(path.join(__dirname, 'uploads')));
    //Routes
    app.use("/manage/product",productRouter);
    app.use("/manage/user", userRouter)
    app.use('/auth/email-verify',verificatinEmailRouter);
    app.use('/auth', authRouter);
    app.use('/invoice', invoiceRouter)
    app.use('/cart', cartRouter)
    app.use('/upload-file', fileRoute)

    const PORT = process.env.PORT || 4000;

    app.listen(PORT,()=>{
        console.log(`SERVER STARTED ON PORT ${PORT}`);
        
    })
}

main().catch(error => console.log("ERROR STARTING SERVER ",error));
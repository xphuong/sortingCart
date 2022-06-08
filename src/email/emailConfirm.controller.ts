
import { Response,Request, RequestHandler, NextFunction } from "express"
import { sendEmail } from "../utils/sendEmail"
import * as jwt from "jsonwebtoken";
import User from "../user/User.entity";
import { TokenType } from "../helper/enum/tokenType.enum";
import { getkey } from "../auth/token.config"


export const sendVerificationMail :RequestHandler =async (req:Request,res:Response,next):Promise<Response> => {
    const {email}:{email:string} = req.body;
    const user = await User.findOne({where:{email}});
    if(!user) return res.status(404).json({
        result: false,
        message: "Email invalid"
    });
    if(user.isVerified) return res.status(406).json({
        result: false,
        message: "User already verified"
    });
    // emailToken = await bcrypt.hash(user.id.toString(),8);
    const emailToken = jwt.sign({email : user.email}, getkey(TokenType.VERIFY_EMAIL) as jwt.Secret,
        {expiresIn:process.env.EMAIL_EXP||'30m'})
    user.emailToken = emailToken;
    await user.save();

    // Send email verification
    const verifyURL = `${req.protocol}://${req.get('host')}/auth/email-verify?token=${emailToken}`;
    const message = `${user.name}! Thank for registering on our site.
                    Please verify your email to continue...:\n\n ${verifyURL}`;
    try{
        await sendEmail({
            email: user.email,
            subject:"Verify your email",
            message
        })
        return res.status(200).json({
            result:true,
            message: "Email sent to your gmail account"
        })
    }catch(err){
        return res.status(500).json({
            result: false,
            message:'Email can not be send'
        });
    }
}

export const verificationEmail: RequestHandler= async(req:Request, res:Response):Promise<Response>=>{
    try{
        const token:any = req.query.token;
        const decodedToken:any = jwt.verify(token, getkey(TokenType.VERIFY_EMAIL));
        const email = decodedToken.email;
        if(!decodedToken.exp){
            return res.status(400).json({
                result: false,
                message:"Link expired"
            })
        }
        const user = await User.findOne({where:{email}});
        if(user){
            user.emailToken = '0';
            user.isVerified = true;
            await user.save()
            return res.status(200).json({
                result: true,
                message:"Verify successfully"
            })
        }else{
            return res.status(403).json({
                result: false,
                message:"Email is not verified"
            })
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({
            result: false,
            message: err
        })
    }
}






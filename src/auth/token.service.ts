import jwt from "jsonwebtoken"
import User from "../user/User.entity";
import moment from "moment"
import { getkey, defaultAccessExp, defaultRefreshExp } from "./token.config"
import { TokenType } from "../helper/enum/tokenType.enum";
import Token from "./token.entity";
import { AppDataSource } from "../config/db";
import { Repository } from "typeorm";



const genToken: any = (user: User, expires: any, type: TokenType) => {
    const payload = {
        id: user.id,
        role: user.role,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    }
    return jwt.sign(payload, getkey(type))
}


const saveToken: any = async (user: User, token: string, type: TokenType, expires: any) => {
    const tokenRepository: Repository<Token> = AppDataSource.getRepository(Token);

    const tokenDb: Token = await Token.create({
        user: user,
        token: token,
        type: type,
        expires: expires.toDate()
    })
    await tokenRepository.save(tokenDb);

    return tokenDb;
}


export const genAuthToken: any = async (user: User) => {
    const accessTokenExp: any = await moment().add(defaultAccessExp, 'minutes')
    const refreshTokenExp: any = await moment().add(defaultRefreshExp, 'days')
    const accessToken: string = await genToken(user, accessTokenExp, TokenType.ACCESS_TOKEN)
    const refreshToken: string = await genToken(user, refreshTokenExp, TokenType.REFRESH_TOKEN)
    await saveToken(user, refreshToken, TokenType.REFRESH_TOKEN, refreshTokenExp)
    return {
        access: {
            token: accessToken,
            expires: accessTokenExp.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExp.toDate(),
        },
    }
}

export const refreshToken: any = async (refreshToken: any, user: any) => {
    const tokenRepository: Repository<Token> = AppDataSource.getRepository(Token);
    let tokenDb = await tokenRepository.findOneBy({
        'user': {id: user},
        token: refreshToken
    })
    console.log(tokenDb)
    if(!tokenDb) return {
        result: false,
        message: "refresh token or user invalid"
    }
    await tokenRepository.delete({token: refreshToken})
    return {
        result: true,
        message: await genAuthToken(user)
    }
}
import { TokenType } from "../helper/enum/tokenType.enum"

const tokenSecret = {
    'ACCESS_TOKEN' : 'acc',
    'REFRESH_TOKEN' : 'rfr',
    'VERIFY_EMAIL' : 'vemail',
    'RESET_PASSWORD' : 'rspw',
}

export const getkey: any = (type: TokenType) => {
    return tokenSecret[type]
}

export const defaultAccessExp = 10 //mins
export const defaultRefreshExp = 10 //days
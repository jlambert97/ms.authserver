import * as jwt from 'jsonwebtoken'
import * as express from 'express'
import { environment } from '../common/env';
import { UserModel } from '../user/user.model';

export const tokenParser: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = extractToken(req)

    if(token){
        jwt.verify(token, environment.security.apiSecret, applyBearer(req, next))
    } else {
        next()
    }
}

function extractToken(req: express.Request) {
    //Authorization: Bearer TOKEN
    const authorization = req.header('authorization')
    if(authorization) {
        const headerParts: string[] = authorization.split(' ')

        if(headerParts.length === 2 && headerParts[0] === 'Bearer') {
            return headerParts[1]
        }
    }

    return undefined
}


function applyBearer (req: express.Request, next: express.NextFunction): (error, decoded) => void {
    return (error, decoded) => {
        if(decoded) {
            UserModel.findByEmail(decoded.sub).then(user => {
                if(user) {
                    //criar campo no express.Request com authenticated do tipo user 
                    (<any>req).authenticated = user
                }
                next()
            }).catch(next)
        } else {
            next()
        }
    }
}
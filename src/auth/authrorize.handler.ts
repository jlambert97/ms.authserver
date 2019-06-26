import * as express from 'express'
import { UserModel } from '../user/user.model'
import * as jwt from 'jsonwebtoken'
import { environment } from '../common/env'

export const authenticate: express.RequestHandler = (req, res, next) => {
    const { email, password } = req.body
    UserModel.findByEmail(email, '+password')
        .then(user => {
            if(user && user.matches(password)){
                //gerar token
                const token = jwt.sign({sub: user.email.toString, iss: 'authserver-api'},
                        environment.security.apiSecret)
                        
            res.json({name: user.name, email:user.email, acessToken: token})
            return next(false)
            } else {
                return next(401)
            }
        }).catch(next)
}
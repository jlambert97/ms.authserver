import * as express from 'express'
import { UserModel } from './user.model'
import { HttpStatusCode } from '../common/statusCodeEnum'

export const findByEmail = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(req.query.email){
        UserModel.findByEmail(req.query.email)
          .then(user => user ? [user] : [])
          .then(doc => {
              if(doc){
                  return res.json({
                      StatusCode: HttpStatusCode.Ok,
                      user: doc
                  })
              }
          })
          .catch(next)
    }else{
      next()
    }
}

export const UserController = {
    //Criar Usuario
    async create(req: express.Request, res: express.Response, next: express.NextFunction) {
        let user = await UserModel.create(req.body)
            .then(user => {
                res.json({
                    StatusCode: HttpStatusCode.Ok,
                    id: user._id
                })
            })
            .catch(next)
    }

}

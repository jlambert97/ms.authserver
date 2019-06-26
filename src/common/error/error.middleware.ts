import * as express from 'express';
import { errorHandler } from './error.handler'
import { HttpStatusCode } from '../statusCodeEnum'

export function errorMiddleware(error: errorHandler, request: express.Request, response: express.Response, next: express.NextFunction) {
    let status = error.status || HttpStatusCode.InternalServerError;
    let message = error.message || 'Erro inesperado';

    //Tratar erros conhecidos
    switch (error.name) {
        case 'MongoError': {
            if(error.code === 11000){ //dados duplicados na base, no caso email
                status = HttpStatusCode.BadRequest
                message = 'Email já existente'
            }
        }
    }

    response
      .status(status)
      .send({
        status,
        message,
      })
}
  
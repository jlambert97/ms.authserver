import * as express from 'express';
import { UserController } from '../user/user.controller'
import { authenticate } from '../auth/authrorize.handler'

const USER_PATH = '/user'

let application = express.Router();

//Criar Usuario
application.post(USER_PATH + '/create', UserController.create)

//Autenticar (Logar)
application.post(USER_PATH + '/authorize', authenticate)





module.exports = application

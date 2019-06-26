import * as express from 'express';
import { environment } from './src/common/env'
import * as mongoose from 'mongoose'
import { errorMiddleware } from './src/common/error/error.middleware'
import { tokenParser } from './src/auth/token.parser'

const app: express.Application = express();

mongoose.connect(environment.mongodb.serverUrl, {
    useNewUrlParser: true
})
mongoose.set('useCreateIndex', true);

app.use(express.json())
app.use(require('./src/common/router'))
app.use(errorMiddleware)
app.use(tokenParser)

app.listen(environment.server.port, function () {
  console.log('Running at port:', environment.server.port);
})

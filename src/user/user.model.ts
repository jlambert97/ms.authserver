import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

export interface User extends mongoose.Document {
    name: String
    email: String
    password: String
    dateOfBirth: Date
    matches(password: string): boolean
}

export interface UserModel extends mongoose.Model<User> {
  findByEmail(email: string, projection?: string): Promise<User>
}

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true  
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    }
})

//---------------------------Middleware
const hashPassword = (obj, next)=>{
    bcrypt.hash(obj.password, 10)
          .then(hash=>{
            obj.password = hash
            next()
          }).catch(next)
}

const saveMiddleware = function (next){
    const user: User = this
    if(!user.isModified('password')){
      next()
    }else{
      hashPassword(user, next)
    }
  }
  
  const updateMiddleware = function (next){
    if(!this.getUpdate().password){
      next()
    }else{
      hashPassword(this.getUpdate(), next)
    }
  }
  
userSchema.pre('save', saveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)
userSchema.pre('update', updateMiddleware)

userSchema.statics.findByEmail = function(email: string, projection: string){
  return this.findOne({email}, projection)
}
userSchema.methods.matches = function(password: string): boolean {
  return bcrypt.compareSync(password, this.password)
}

export const UserModel = mongoose.model<User, UserModel>('User', userSchema)
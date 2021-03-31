import mongoose from 'mongoose'

const Schema = mongoose.Schema

const Users = mongoose.model('User',new Schema({
    name:{type:String, required:[true,'Why no name?']},
    email: {type: String, required:[true, 'Why no email?']},
    password: {type:String, required:[true, 'Who no password']},
    salt: { type:String, default:'12345'},
    role: { type: String, default:'user'}// admin
}))

module.exports = Users
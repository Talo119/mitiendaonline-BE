import express from 'express'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import Users from '../models/users'

const router = express.Router()

const signToken = (userDB) =>{
    return jwt.sign({userDB},'mi-secreto',{
        expiresIn:60 * 60 * 24 * 365, 
    })
}

router.get('/', (req,res) =>{
    Users.find()
        .exec()
        .then(x => res.status(200).send(x))
        
})

router.get('/:id', (req, res) => {
    Users.findById(req.params.id)
        .exec()
        .then( x => res.status(200).send(x))
})

router.post('/', (req, res) => {
    const {name,email,password} = req.body
    crypto.randomBytes(16,(err,salt)=>{
        const newSalt = salt.toString('base64')
        crypto.pbkdf2(password, newSalt,1000,64,'sha1',(err,key) =>{
            const encryptedPassword = key.toString('base64')
            Users.findOne({email}).exec()
                .then(user =>{
                    if (user) {
                        return res.send('Usuario ya existente')
                    }
                    Users.create({
                        name:name,
                        email:email,
                        password:encryptedPassword,
                        salt:newSalt
                    })
                    .then(x => res.status(201).send(x))
                    .catch(err => res.status(500).send(err))

                })
        })
    })
    
})

router.post('/login',(req,res) =>{
    const {email,password} = req.body
    Users.findOne({email}).exec()
        .then(user =>{
            if (!user) {
                return res.send('1.Usuario y/o contraseña incorrecta.')
            }
            crypto.pbkdf2(password,user.salt,1000,64,'sha1',(err,key) =>{
                const encryptedPassword = key.toString('base64')
                if (user.password === encryptedPassword) {
                    const token = signToken(user)
                    return res.status(200).send({token})
                }
                return res.send('2.Usuario y/o contraseña incorrecta.')
            })
        })
})

router.put('/:id',(req,res) =>{
    Users.findOneAndUpdate(req.params.id, req.body)
    .then(() => res.sendStatus(204))
})

router.delete('/:id', (req, res) =>{
    Users.findOneAndDelete(req.params.id)
    .exec()
    .then(() => res.sendStatus(204))
})

module.exports = router
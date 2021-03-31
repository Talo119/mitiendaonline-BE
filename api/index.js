import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import users from './routes/users'
const app = express()

app.use(bodyParser.json())
app.use(cors())

mongoose.connect(process.env.URI_MONGO, { useNewUrlParser: true, useUnifiedTopology: true } )



app.use('/api/users', users)

/*app.get('*', (req, res) =>{
    res.send('Chanchito Feliz')
})*/

module.exports = app

//mongodb+srv://cmotino:CMotinoh1190*@micluster.e2u3t.mongodb.net/sistema?retryWrites=true&w=majority


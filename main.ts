import express, { Application } from 'express';
import 'dotenv/config';

import { setDBConnection } from './db/connection.js'
import { authRouter } from './src/routes/auth.js'

setDBConnection().catch(err => {
    console.log('Unable to connect to DB');
})

const app: Application = express();

const port = process.env.PORT || 3000


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes 
app.use('/auth', authRouter);


// API
app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
import express, { Application } from 'express';
import 'dotenv/config';

const app: Application = express();

const port = process.env.PORT || 3000


app.use(express.json());

// API Routes 
// app.use('/path', routes)


// API
app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
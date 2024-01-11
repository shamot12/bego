import express from 'express';
import 'dotenv/config';
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
// API Routes 
// app.use('/path', routes)
// API
app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});

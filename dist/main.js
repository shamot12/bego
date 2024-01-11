import express from 'express';
import 'dotenv/config';
import helmet from 'helmet';
import { setDBConnection } from './db/connection.js';
import { authRouter } from './src/routes/auth.js';
import { pointsRouter } from './src/routes/points.js';
import { trucksRouter } from './src/routes/trucks.js';
import { notFound, validRequest } from './src/middleware/validation.js';
setDBConnection().catch(err => {
    console.log('Unable to connect to DB');
});
const app = express();
app.use(helmet());
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// API Public Routes 
app.use('/auth', authRouter);
// Authentication middleware
app.use(validRequest);
// API authentication required routes 
app.use('/points', pointsRouter);
app.use('/trucks', trucksRouter);
// Server validation
app.use(notFound);
// API
app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
